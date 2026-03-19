### Palette Construction
- Use 1 primary color, 1 accent color, and 1 neutral (background)
- Generate harmonious palettes from these Tailwind color families:
  - Warm: rose, orange, amber, yellow
  - Cool: blue, cyan, teal, emerald
  - Neutral: slate, zinc, gray, stone
  - Vibrant: purple, pink, indigo, violet
- Limit the total number of distinct colors to 3-4 per poster to maintain cohesion
- Use shades of the same hue (e.g., blue-400, blue-600, blue-900) for depth without adding new colors

### Gradient Patterns
- Hero backgrounds: bg-gradient-to-br from-{color}-600 via-{color}-700 to-{color}-900
- Subtle overlays: bg-gradient-to-t from-black/60 to-transparent
- Accent gradients: bg-gradient-to-r from-pink-500 to-purple-500
- Multi-stop: use via-{color} for three-color gradients
- Radial gradient (inline style): style="background: radial-gradient(circle at 30% 40%, #7c3aed 0%, #1e1b4b 70%)"
- Mesh gradient effect: layer 2-3 absolute-positioned divs with radial gradients and blur-3xl
- Gradient direction meanings:
  - to-b (top to bottom): calm, settled, natural (sky to ground)
  - to-br (top-left to bottom-right): dynamic, forward motion
  - to-r (left to right): progression, timeline, before-to-after

### Mood-Based Color Selection
- Professional/corporate: blue-700, slate-800, white
- Creative/fun: purple-500, pink-500, yellow-400
- Elegant/luxury: black, gold (amber-400), white
- Nature/organic: emerald-600, green-700, amber-500
- Tech/modern: indigo-600, cyan-400, slate-900
- Urgent/sale: red-600, yellow-400, black
- Calm/wellness: teal-400, sky-200, white
- Food/restaurant: orange-500, red-700, amber-100
- Music/nightlife: violet-600, fuchsia-500, black
- Education/learning: blue-500, amber-400, slate-100
- Holiday/festive: red-600, green-700, amber-300

### Contrast Rules
- WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text
- Never use light text on light background or dark on dark
- Test: white text needs bg darkness of at least 600 shade
- Use bg-black/40 or bg-white/80 overlays to ensure readability
- For colored text on colored backgrounds, ensure sufficient luminance difference
- Safe combos: white on any 700+ shade, black on any 300- shade

### Color Application Strategy
- Background: Use the darkest or lightest shade — it covers the most area and should not compete
- Primary content color: Apply to headline text or the largest visual element
- Accent color: Use sparingly on CTAs, underlines, icons, or small decorative elements
- Never apply accent color to more than 10-15% of the poster area
- Use opacity variants (e.g., bg-purple-500/20) for large decorative shapes so they do not overpower

### Dark vs Light Mode Posters
- Dark posters (bg-gray-900, bg-slate-950, bg-black):
  - Text: text-white, text-gray-100
  - Accents pop more; use saturated colors (500-600 shades)
  - Add subtle glow effects for depth
- Light posters (bg-white, bg-gray-50, bg-stone-100):
  - Text: text-gray-900, text-slate-800
  - Use deeper accent shades (600-700) to maintain contrast
  - Borders and shadows provide structure: border border-gray-200, shadow-sm
