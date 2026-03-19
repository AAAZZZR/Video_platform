### Font Hierarchy
- Title/headline: text-4xl to text-7xl, font-bold or font-extrabold
- Subtitle: text-xl to text-3xl, font-semibold
- Body text: text-sm to text-lg, font-normal
- Caption/small: text-xs, font-medium, text-opacity-70
- Oversized decorative text: text-8xl or text-9xl, font-black, use for single words or numbers as visual anchors

### Font Pairing Rules
- Use maximum 2 fonts: one for headlines, one for body
- Recommended Google Font pairs:
  - Inter (body) + Playfair Display (headline)
  - Noto Sans TC (body) + Noto Serif TC (headline) [Chinese]
  - Roboto (body) + Montserrat (headline)
  - Source Han Sans (body) + Source Han Serif (headline) [CJK]
  - DM Sans (body) + DM Serif Display (headline)
  - Lato (body) + Merriweather (headline)
  - Open Sans (body) + Raleway (headline)
- Import fonts via: <style>@import url('https://fonts.googleapis.com/css2?family=...');</style>
- Always specify weights explicitly in the import URL: wght@400;700;900
- Include a fallback stack: style="font-family: 'Inter', system-ui, sans-serif"

### Text Spacing
- Line height: leading-tight (1.25) for headlines, leading-relaxed (1.625) for body
- Letter spacing: tracking-tight for large text (text-4xl and above), tracking-wide for small uppercase labels
- Use uppercase + tracking-widest for labels and categories
- For multi-line headlines, use leading-none (1.0) or leading-tight (1.25) to keep lines visually grouped
- Add margin-bottom (mb-2 to mb-4) after headlines to separate from body text

### Text Contrast
- On dark backgrounds: text-white or text-gray-100
- On light backgrounds: text-gray-900 or text-black
- Add text-shadow via inline style for text over images/gradients:
  style="text-shadow: 0 2px 10px rgba(0,0,0,0.5)"
- For critical readability over busy backgrounds, add a semi-transparent backdrop:
  <span class="bg-black/50 px-4 py-2 inline-block">Text here</span>
- Never use pure gray text on colored backgrounds; tint the gray toward the background hue

### Text Decoration Techniques
- Underline accent: Use a <div class="w-16 h-1 bg-yellow-400 mt-2"> under a heading
- Highlighted text: <span class="bg-yellow-300/30 px-1"> for marker-style highlight
- Outlined text: style="-webkit-text-stroke: 2px white; color: transparent" for outline-only effect
- Gradient text: style="background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent"

### Responsive Text Sizing
- When generating posters at different sizes, scale all text proportionally
- For a 1080px wide poster, text-6xl (~60px) is a good headline size
- For a 1920px tall story, text-7xl to text-8xl headlines fill the space properly
- Minimum readable size: text-xs (12px) — never go smaller on posters
