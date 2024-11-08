# GTM Lite-Vimeo Module

This code is modified, with gratitude, from [this Lunametrics article](https://www.analyticsmania.com/post/track-videos-with-google-analytics-4-and-google-tag-manager/#vimeo-listener) (shoutout to @notdanwilkerson). The source code is located at `src/source/lite-vimeo-gtm-tracker.js` and `src/source/utilities.ts`.

## At a Glance

The `/dist/gtm/index.js` file is what you need for Google Tag Manager. The `src/class-lite-vimeo-gtm-tracker.js` file is what gets transpiled to ES6.

## Getting Started

1.  Copy the `gtm/index.js` into Google Tag Manager as a "Custom HTML" Tag.
2.  Wire up a Data Layer Variable with the event parameters
3.  Wire up Google Analytics to track the events.

## Background & Overview

Because Lite-Vimeo makes use of the Shadow DOM, the original code for this can't be used as-is, so I (@kjroelke) rewrote v1 of the code in Typescript to allow for types and to add more documentation, while Parcel and Babel handle transpiling the code into vanilla, ES6 JS.

I removed a lot of the, in my opinion, redundant Array methods (e.g. `foreach_` or `map_`) and tried to rename functions in a more self-documenting way.

---

# Changelog

## v1.0.1

-   Swap @slightlyoff package for Choctaw Nation package
-   Update code to handle events properly and catch errors

## v1.0.0

-   init!
