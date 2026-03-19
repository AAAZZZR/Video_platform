### Platform Dimensions
- Instagram Square: 1080x1080
- Instagram Story/Reel: 1080x1920
- Instagram Portrait: 1080x1350
- Facebook Post: 1200x630
- Facebook Story: 1080x1920
- LinkedIn Post: 1200x627
- LinkedIn Story: 1080x1920
- Twitter/X Post: 1200x675
- Twitter/X Header: 1500x500
- YouTube Thumbnail: 1280x720
- Pinterest Pin: 1000x1500
- TikTok Cover: 1080x1920
- Threads Post: 1080x1080

### Setting Dimensions in HTML
- Apply dimensions on the outermost container div:
  <div style="width: 1080px; height: 1080px;" class="relative overflow-hidden bg-slate-900">
- For story formats: style="width: 1080px; height: 1920px;"
- Always set overflow-hidden to clip decorative elements at edges

### Platform-Specific Tips
- Instagram: Bold visuals, minimal text, strong center focus. Carousel-friendly: design each slide to work standalone and as a series.
- LinkedIn: Professional, clean, data-driven content works well. Use charts, statistics, and structured layouts. Blue tones feel native.
- Twitter/X: High contrast for small preview, key message visible at small sizes. The left side may be partially covered by profile pic in timeline.
- YouTube Thumbnail: Face + emotion + 3-4 words max, bright colors. Use thick text outlines for readability at small sizes. Yellow + red + white is the classic high-CTR palette.
- Pinterest: Vertical, text overlay on top/bottom, aspirational imagery. Step-by-step and list formats perform well.
- TikTok: Vertical format, bold and trendy, text should be large enough to read on mobile.
- Facebook: Slightly more text is acceptable. Ensure the link preview crop (center region) looks good.

### Text Density Rules
- Instagram: Max 20% text coverage (Facebook's old rule, still good practice)
- Thumbnails: 3-5 words maximum
- LinkedIn: Can be text-heavier for infographics
- Stories: Short, punchy, one message per slide
- Pinterest: Moderate text OK, especially for tutorials and lists
- Rule of thumb: If you squint and cannot read the text, there is too much of it

### Safe Zones
- Keep critical content within 80% of the center area
- Platform UI elements may overlay edges (profile pics, like buttons)
- Add extra padding (p-8 minimum) to account for cropping
- Instagram story safe zone: Avoid top 14% (camera/time bar) and bottom 20% (swipe up / message bar)
- YouTube thumbnail: Avoid bottom-right corner (timestamp overlay)
- Pinterest: Avoid bottom 10% (save button and UI overlays)
- TikTok: Avoid right edge (like/comment/share buttons) and bottom 25% (caption area)

### Carousel / Multi-Slide Design
- First slide: Hook — the most compelling visual or statement
- Middle slides: Content — information, steps, data
- Last slide: CTA — follow, share, visit link
- Maintain consistent:
  - Background color or gradient across all slides
  - Font choices and sizes
  - Element positioning (e.g., title always at top)
  - Color palette
- Add a subtle page indicator: small dots or "2/5" in a corner

### Social Media Color Psychology
- Red/Orange: Urgency, excitement, food brands — high engagement for sales
- Blue: Trust, calm, professional — good for tips and educational content
- Green: Health, growth, money — eco and finance content
- Purple: Creativity, luxury, mystery — beauty and lifestyle
- Yellow: Optimism, attention-grabbing — caution/sale announcements
- Black/Dark: Premium, serious, dramatic — tech and fashion
- Pastel palette: Soft, approachable, feminine — wellness and lifestyle

### Engagement-Optimized Patterns
- "Did You Know?" format: Large question + surprising answer
- Listicle: Numbered items (3, 5, 7, 10) with clean formatting
- Quote card: Large quote text + attribution + decorative quotation marks
- Before/After: Split layout with clear contrast
- Stat highlight: One big number + context
- Meme format: Bold top text + bold bottom text + center visual
- Hot take / opinion: Contrasting colors (agree/disagree) with bold statement

### Branding Consistency
- Reserve a consistent corner for logo placement (top-left or bottom-right most common)
- Use a consistent color accent across all posts for brand recognition
- Keep the same font pairing across an entire content series
- Add a subtle branded element: a small colored bar, a watermark, or a tag line
- Handle/URL placement: text-xs at the bottom, subtle but present: @handle or website.com
