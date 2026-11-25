# Background videos

Drop videos here and they play automatically behind the section, muted and looping:

| File | Where |
| --- | --- |
| hero.mp4 (+ optional hero.webm) | Opening screen of the home page |
| closing.mp4 (+ optional closing.webm) | "Let's Plan Your Perfect Feast" section on every page |

Also save a still frame as `images/photos/hero.jpg` / `closing.jpg`; it shows while the video loads.
If a file is missing, the section simply shows its photo or colour background.

Make each clip small and fast (8 to 12 seconds, landscape, no sound, about 2 to 4 MB):

```
ffmpeg -i input.mov -t 10 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i input.mov -t 10 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -crf 38 -b:v 0 hero.webm
ffmpeg -i hero.mp4 -ss 2 -frames:v 1 -q:v 3 ../images/photos/hero.jpg
```
