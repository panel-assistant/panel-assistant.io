---
title: Panel Firmware Archive Privacy Policy
description: How Panel Firmware Archive handles Google Drive data for private preservation and analysis.
comments: false
---

Effective date: 14 October 2026.

## Who operates the tool

Panel Firmware Archive is operated by the Panel Assistant project. This policy covers its desktop Google Drive archive tool and the policy pages on this website. The tool preserves firmware and related technical material encountered by the project in a private archive controlled by the authorised account owner. Material may come from vendor, community or unofficial sources and is retained for provenance checks, analysis and research.

## Google access and data used

The tool requests Google's Google Drive permission, `https://www.googleapis.com/auth/drive`. That permission allows it to view and manage files across the authorised Drive account. Its archive operations are configured for a selected folder; Google does not restrict this permission to that folder.

The tool handles selected file contents and file or folder metadata, including names, identifiers, sizes, checksums and timestamps. It uses this information to list archive contents, create folders, upload or download files, compare copies and verify transfers. An operator can also replace or remove archived files when managing the archive.

Google issues access and refresh tokens after the account owner authorises the tool. These credentials allow the operator's computer to make authorised Drive requests. Local operation logs can contain file paths, transfer results, metadata and errors.

## Use, storage and human access

Drive data is used to carry out private preservation, verification and analysis operations requested by an authorised operator. The account owner and operators explicitly authorised by that owner can inspect the selected archive files and metadata they manage. We do not sell Google user data, use it for advertising or use it to train machine learning models.

Archived files are stored in the account owner's Google Drive. Working copies and operation records may also be retained on the operator's computer for verification and analysis. OAuth credentials are stored in locally protected configuration files and kept out of archived firmware packages, public source repositories and published documentation.

The archive is for private project preservation and analysis. The owner may privately share a direct download link for a selected file with an intended recipient for private use. Those links must not be republished or used to redistribute the firmware. We do not publish Google Drive archive links on this website, in public documentation, in social posts or in the public firmware catalogue.

Public firmware references instead use vendor-published release URLs and corresponding confirmed Internet Archive captures. Publishing these policy pages does not publish the Google Drive archive or grant access to its contents.

Panel Firmware Archive's use and transfer of information received from Google APIs will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including its Limited Use requirements.

## Retention, deletion and stopping access

Firmware archives are kept for ongoing preservation until their owner removes them. There is no automatic deletion schedule. Local working copies and operation records are retained as needed for verification and maintenance and can be removed by the operator.

The account owner can delete archived files in Google Drive and empty the Drive trash when permanent deletion is intended. The operator can remove local copies, logs and saved credentials from the computer running the tool.

You can stop future Google access by removing Panel Firmware Archive from your [Google Account connections](https://myaccount.google.com/connections). Revoking access does not delete files already stored in Drive or copies already retained locally.

## Visiting these pages

This website is delivered through Cloudflare, which receives normal web request information such as an IP address and browser details. These policy pages do not receive Google OAuth credentials or Google Drive file contents. Comments are disabled on these policy pages.

## Questions and changes

For privacy questions or deletion requests, email the project at [privacy@panel-assistant.io](mailto:privacy@panel-assistant.io). Do not include account credentials in your message.

Changes to this policy will be published on this page with a revised effective date. A new use of Google data beyond the purposes described here requires appropriate notice and consent.

See the [Terms of service](/firmware-archive/terms/).
