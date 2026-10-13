#!/usr/bin/env bash
# Recover a Shelly Wall Display that reboots in a loop.
#
# Guide: https://panel-assistant.io/hardware/panels/shelly/#recovering-a-panel-that-reboots-in-a-loop
#
# Needs bash (macOS, Linux, or Git Bash on Windows) and Android platform-tools (adb and fastboot)
# on PATH. The panel must be connected by USB with USB debugging already on.
#
#   shelly-bootloop-rescue.sh SERIAL catch     Catch the panel during a boot, save its crash record,
#                                              and send it to its bootloader. Changes nothing.
#   shelly-bootloop-rescue.sh SERIAL wipe      From the bootloader, format the data partitions and
#                                              restart. ERASES ALL DATA on the panel; asks first.
#   shelly-bootloop-rescue.sh SERIAL reboot    Leave the bootloader and start Android, without wiping.
#
# SERIAL is the panel's serial as `adb devices` lists it. Every command names it, so a second panel or
# an emulator on the same computer is never touched.

set -u

usage() { sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//'; exit 2; }

[ $# -eq 2 ] || usage
serial=$1
action=$2
attempts=${RESCUE_ATTEMPTS:-40}   # boots to try before giving up; each boot is about 17 seconds
fastboot_wait=${RESCUE_FASTBOOT_WAIT:-20}   # seconds to wait for the bootloader after each try

for tool in adb fastboot; do
  command -v "$tool" >/dev/null 2>&1 || { echo "$tool not found: install Android platform-tools and put them on PATH" >&2; exit 1; }
done

a() { adb -s "$serial" "$@"; }
fb() { fastboot -s "$serial" "$@"; }
in_bootloader() { fastboot devices 2>/dev/null | awk '{print $1}' | grep -qxF "$serial"; }

catch() {
  if in_bootloader; then echo "The panel is already in its bootloader."; return 0; fi
  record="crash-record-$serial-$(date +%Y%m%d-%H%M%S).txt"
  echo "Waiting for the panel. It answers for a few seconds on each boot; this keeps trying for up to $attempts boots."
  attempt=1
  while [ "$attempt" -le "$attempts" ]; do
    a wait-for-usb-device 2>/dev/null
    # Act at once: the window closes when the panel restarts.
    # shellcheck disable=SC2016 # expands on the panel, not here
    a shell 'for f in /sys/fs/pstore/*; do echo "== $f"; cat "$f"; done' >> "$record" 2>&1
    a reboot bootloader 2>/dev/null
    waited=0
    while [ "$waited" -lt "$fastboot_wait" ]; do
      if in_bootloader; then
        echo "The panel is in its bootloader after $attempt attempt(s); the loop has stopped."
        echo "Crash record saved to $record. Look for 'Kernel panic' or 'Unable to handle' near its end."
        return 0
      fi
      sleep 1; waited=$((waited + 1))
    done
    echo "Attempt $attempt missed the window; trying again on the next boot."
    attempt=$((attempt + 1))
  done
  echo "The panel never reached its bootloader under serial $serial." >&2
  others=$(fastboot devices 2>/dev/null | awk '{print $1}')
  if [ -n "$others" ]; then
    echo "The bootloader lists these devices instead: $others" >&2
    echo "If one of them is the panel, use that serial for the wipe and reboot steps." >&2
  else
    echo "Check the cable carries data and that USB debugging is on." >&2
  fi
  return 1
}

wipe() {
  in_bootloader || { echo "The panel is not in its bootloader. Run: $0 $serial catch" >&2; return 1; }
  echo "This formats the panel's data partitions (userdata and metadata)."
  echo "It ERASES all apps, settings and Wi-Fi on the panel, and returns Shelly's software to the version the panel"
  echo "was made with. The firmware and the bootloader are not touched."
  printf 'To continue, type the serial %s: ' "$serial"
  read -r answer
  [ "$answer" = "$serial" ] || { echo "Not confirmed; nothing was changed. The panel stays in its bootloader."; return 1; }
  # Format, not erase: an erased data partition leaves the panel stuck at the boot logo.
  # The warnings that the partition type is U-Boot are expected and harmless.
  fb format:ext4 metadata || { echo "Formatting metadata failed; the panel stays in its bootloader." >&2; return 1; }
  fb format:ext4 userdata || { echo "Formatting userdata failed; the panel stays in its bootloader." >&2; return 1; }
  fb reboot
  echo "Restarting. The first start after a wipe takes a few minutes; then Shelly's setup screen appears."
}

reboot_android() {
  in_bootloader || { echo "The panel is not in its bootloader." >&2; return 1; }
  fb reboot
}

case "$action" in
  catch) catch ;;
  wipe) wipe ;;
  reboot) reboot_android ;;
  *) usage ;;
esac
