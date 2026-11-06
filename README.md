# AWS Builder Center — 90-Day Streak Tracker

A personal dashboard for tracking the 90-day challenge from **November 7, 2026** through **February 4, 2027**, using **Asia/Karachi (PKT)**.

## Dashboard

After enabling GitHub Pages, open:

https://coderameez.github.io/aws-builder-center-streak/

The dashboard includes:
- 90-day calendar and completion history
- Current and best consecutive-day streak
- Overall progress and remaining days
- Daily notes and JSON export

Check-ins are stored in the browser's local storage. They are not automatically synced between browsers or devices. Export your history periodically to keep a backup.

## Daily reminder

The GitHub Actions workflow runs at **16:00 UTC (21:00 PKT)** and creates one GitHub issue per challenge day. GitHub may delay scheduled workflows. Enable repository issue notifications or watch the repository if you want GitHub notifications.

To enable the dashboard:
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**, then save.

To enable reminders:
1. Open **Settings → Actions → General**.
2. Ensure Actions are allowed to run.
3. Under workflow permissions, allow the workflow to create issues if the repository settings require it.

## Important

This is a manual tracker and reminder system. It does not connect to AWS Builder Center, verify challenge eligibility, sign in, or automate likes, comments, posts, or any other platform engagement. Follow the official AWS Builder Center challenge rules and verify that each day's activity is credited on your profile before marking it complete.

## Files

- `index.html`, `styles.css`, `app.js`: static dashboard
- `.github/workflows/daily-reminder.yml`: scheduled GitHub issue reminder