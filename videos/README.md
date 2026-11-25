# Background videos

Every big section has its own video spot. They play muted and looping behind the words.
To swap in a real clip, save it here with the **same file name** (and a still frame in `images/photos/` with the same name). No code to change.

| Page and section | Video file | Still frame |
| --- | --- | --- |
| Home 01, opening screen | hero.mp4 / hero.webm | images/photos/hero.jpg |
| Home 02, Explore Our Menus | teh-tarik.mp4 / .webm | images/photos/teh-tarik.jpg |
| Home 03, Signature Dishes | biryani-scoop.mp4 / .webm | images/photos/biryani-scoop.jpg |
| Home 04, Thoughtful Cooking | buffet-spread.mp4 / .webm | images/photos/buffet-spread.jpg |
| Home 05, Honoured to Serve | sweets.mp4 / .webm | images/photos/sweets.jpg |
| "Let's Plan Your Perfect Feast" (every page) | closing.mp4 / .webm | images/photos/closing.jpg |
| Menus page top | bento-packing.mp4 / .webm | images/photos/bento-packing.jpg |
| Catering page top | live-station.mp4 / .webm | images/photos/live-station.jpg |
| Gallery page top | kitchen.mp4 / .webm | images/photos/kitchen.jpg |
| About page top | our-story.mp4 / .webm | images/photos/our-story.jpg |
| Contact page top | welcome.mp4 / .webm | images/photos/welcome.jpg |

The opening video loads straight away. All the others load only when someone scrolls near them, and pause when scrolled away, so phones don't waste data.
If a file is missing, the section simply shows its photo or colour background. People who turn off motion on their device see the still frames.

Make each clip small and fast (8 to 12 seconds, landscape, no sound, about 2 to 4 MB). `.webm` is optional (smaller); `.mp4` alone works everywhere.

```
ffmpeg -i input.mov -t 10 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart NAME.mp4
ffmpeg -i input.mov -t 10 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -crf 38 -b:v 0 NAME.webm
ffmpeg -i NAME.mp4 -ss 2 -frames:v 1 -q:v 3 ../images/photos/NAME.jpg
```

## Current placeholders

All the videos here now are temporary animations drawn in code for this project (no stock footage, no licence needed):
a copper biryani pot with rising steam (hero, biryani-scoop, live-station), a steel mug "pulling" teh tarik (teh-tarik),
and warm gold sparkles with drifting steam (the rest). Replace them with Kamal's own footage using the same file names.

## Steam opening

The full-screen steam that clears to show the site is drawn live in `js/main.js` (no video file). It plays once per visit, can be skipped with a tap, and is skipped for people who turn off motion.
