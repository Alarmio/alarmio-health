# Alarmio Health privacy notice

Last updated: 26 November 2026

This notice explains what the Alarmio Health integration for Home Assistant sends to Alarmio, why, and what you can do about it. It is written to follow South Africa's Protection of Personal Information Act (POPIA).

## Who is responsible

**Alarmio** (alarmio.net) is the responsible party for the information described here.

Contact for questions, access, correction or deletion requests: **support@alarmio.net**.

## What Alarmio Health sends

About once a minute, Alarmio Health sends a small status message (a "heartbeat") to Alarmio. Alarmio recognises you from the Alarmio session your Home Assistant already uses to talk to Alarmio; the message itself contains no account or subscriber ID.

**Always sent**

| Item | Detail |
|---|---|
| Format version, time sent, integration version | Technical housekeeping |
| For each of the six checks | Its name, status (healthy, degraded, down or unknown), response time and a short reason |

The short reasons can mention the foXaCe version and counts such as "2 offline, 1 low battery".

**Sent only if you turn on "Share diagnostics with Alarmio"** (it is off by default, and you can turn it off again at any time)

| Item | Why it matters |
|---|---|
| Home Assistant and foXaCe versions, connection mode, reconnect count | Helps us find compatibility problems |
| Whether your alarm is armed | Over time this can show when your home is occupied |
| A list of your Ajax devices: **the names you gave them**, whether each is online, malfunction count, battery and signal | Helps us spot failing devices. It is shortened to about 12 KiB, most urgent devices first |

The panel's **What is sent to Alarmio** section shows the exact data. Turning the switch off stops the extra data from the next heartbeat on.

## What is never sent

Your passwords, the value of your session token as data (it is only used to prove who is calling), camera or video, and any command. Alarmio Health never arms or disarms your alarm.

## Why we collect it

- **The always-on status message** lets us see that your setup is working and helps us (and you) diagnose problems with the service you use. It is part of providing that service.
- **The diagnostics** are used only to find and fix problems. We use them only if you choose to turn them on. Your choice is your consent, and you can withdraw it by turning the switch off.

We do not sell this information and do not use it for advertising.

## Who can see it

Alarmio and the people who operate the Alarmio service. We do not share it with other companies.

## How long we keep it

- Only your **most recent heartbeat** is stored. A new one replaces it, and it expires on its own after 7 days if no new one arrives.
- Ordinary server logs (time, IP address, request and result) are kept to run and secure the service and are rotated automatically.

## Your rights

You may ask us what we hold about you, ask us to correct or delete it, and object to its use. You may also complain to the Information Regulator (South Africa). Write to **support@alarmio.net**.

## Changes

If this notice changes, the date above changes. Changes that affect what is sent will also be noted in the release notes.
