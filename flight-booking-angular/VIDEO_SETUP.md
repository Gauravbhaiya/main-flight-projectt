# Flight Takeoff Video Background Setup

## Overview
Your login and register pages now have an amazing flight takeoff video background with animated particles and clouds for a super cool effect!

## How to Add Your Video

### Step 1: Create Videos Folder
```bash
mkdir src/assets/videos
```

### Step 2: Add Your Flight Video
1. Download a flight takeoff video (recommended: 1920x1080, MP4 format)
2. Name it `flight-takeoff.mp4`
3. Place it in `src/assets/videos/flight-takeoff.mp4`

### Step 3: Video Recommendations
**Best video sources for flight takeoff:**
- **Pexels**: https://www.pexels.com/search/videos/airplane%20takeoff/
- **Pixabay**: https://pixabay.com/videos/search/airplane%20takeoff/
- **Unsplash**: https://unsplash.com/s/videos/airplane-takeoff

**Video specifications:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 or higher
- Duration: 10-30 seconds (will loop)
- Size: Under 10MB for better performance

### Step 4: Alternative Video URLs
If you can't add a local video, you can use these free video URLs:

```typescript
// In login.component.ts and register.component.ts, replace the video sources:
<source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
<source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
```

## Features Added

### 🎬 Video Background
- Full-screen flight takeoff video
- Auto-play, muted, and looping
- Responsive design for all devices
- Fallback gradient background

### ✨ Animated Effects
- **Flying Particles**: White dots that fly across the screen
- **Floating Clouds**: Cloud emojis that drift across
- **Video Overlay**: Gradient overlay for better text readability
- **Blur Effects**: Subtle backdrop blur for depth

### 📱 Mobile Optimized
- Reduced video brightness on mobile
- Smaller particle sizes
- Optimized performance

## Customization Options

### Change Video Overlay Color
```css
.video-overlay {
  background: linear-gradient(
    135deg,
    rgba(YOUR_COLOR_R, YOUR_COLOR_G, YOUR_COLOR_B, 0.75) 0%,
    rgba(YOUR_COLOR_R, YOUR_COLOR_G, YOUR_COLOR_B, 0.75) 100%
  );
}
```

### Adjust Video Brightness
```css
.background-video {
  filter: brightness(0.6) contrast(1.3) saturate(1.1);
}
```

### Modify Particle Speed
```css
@keyframes flyParticle {
  /* Change 8s to your preferred duration */
  animation: flyParticle 8s linear infinite;
}
```

## Troubleshooting

### Video Not Playing?
1. Check if the video file exists in `src/assets/videos/`
2. Ensure the video format is MP4
3. Check browser console for errors
4. Try a different video URL

### Performance Issues?
1. Reduce video file size (compress to under 5MB)
2. Lower video resolution to 1280x720
3. Use shorter video duration (10-15 seconds)

### Mobile Issues?
1. Add `playsinline` attribute (already included)
2. Ensure video is under 5MB
3. Test on actual mobile devices

## Browser Support
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ⚠️ IE 11 (fallback gradient only)

## File Structure
```
src/
├── assets/
│   ├── videos/
│   │   └── flight-takeoff.mp4  (your video here)
│   └── video-background.css
├── app/
│   └── components/
│       ├── login.component.ts
│       └── register.component.ts
```

Enjoy your awesome flight-themed login and register pages! ✈️🚀