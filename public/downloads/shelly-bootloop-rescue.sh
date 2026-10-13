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

usage() {
  cat <<'EOF'
Usage: shelly-bootloop-rescue.sh SERIAL STEP

  catch    Catch the panel during a boot, save its crash record, and send it to its bootloader.
           Changes nothing on the panel.
  wipe     From the bootloader, format the data partitions and restart.
           ERASES ALL DATA on the panel; asks you to type the serial first.
  reboot   Leave the bootloader and start Android, without wiping.

SERIAL is the panel's serial as `adb devices` lists it.
EOF
  exit 2
}

[ $# -eq 2 ] || usage
serial=$1
action=$2
attempts=${RESCUE_ATTEMPTS:-40}   # boots to try before giving up; each boot is about 17 seconds
fastboot_wait=${RESCUE_FASTBOOT_WAIT:-20}   # seconds to wait for the bootloader after each try
boot_wait=${RESCUE_BOOT_WAIT:-60}           # seconds to wait for the panel to answer on a boot

for tool in adb fastboot; do
  command -v "$tool" >/dev/null 2>&1 || { echo "$tool not found: install Android platform-tools and put them on PATH" >&2; exit 1; }
done

a() { adb -s "$serial" "$@"; }
fb() { fastboot -s "$serial" "$@"; }
in_bootloader() { fastboot devices 2>/dev/null | awk '{print $1}' | grep -qxF "$serial"; }
adb_state() { adb devices 2>/dev/null | awk -v s="$serial" '$1 == s {print $2}'; }

# Poll rather than `adb wait-for-usb-device`, which waits for ever on a mistyped serial.
wait_for_panel() {
  waited=0
  while [ "$waited" -lt "$boot_wait" ]; do
    [ "$(adb_state)" = device ] && return 0
    sleep 1; waited=$((waited + 1))
  done
  return 1
}

catch() {
  if in_bootloader; then echo "The panel is already in its bootloader."; return 0; fi
  record="crash-record-$serial-$(date +%Y%m%d-%H%M%S).txt"
  echo "Waiting for the panel. It answers for a few seconds on each boot; this keeps trying for up to $attempts boots."
  attempt=1
  while [ "$attempt" -le "$attempts" ]; do
    if ! wait_for_panel; then
      state=$(adb_state)
      if [ -n "$state" ]; then echo "Attempt $attempt: the panel answers as '$state', not ready for commands." >&2
      else echo "Attempt $attempt: no device with serial $serial answered within ${boot_wait}s." >&2; fi
      attempt=$((attempt + 1)); continue
    fi
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
    echo "Check the cable carries data and that USB debugging is on. If the panel now shows a bootloader screen" >&2
    echo "but fastboot lists nothing, this computer needs a USB driver for the bootloader (Windows)." >&2
  fi
  return 1
}

wipe() {
  in_bootloader || { echo "The panel is not in its bootloader. Run: $0 $serial catch" >&2; return 1; }
  echo "This formats the panel's data partitions (userdata and metadata)."
  echo "It ERASES all apps, settings and Wi-Fi on the panel, and returns Shelly's software to the version the panel"
  echo "was made with. The firmware and the bootloader are not touched."
  printf 'To continue, type the serial %s: ' "$serial"
  read -r answer || answer=
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
