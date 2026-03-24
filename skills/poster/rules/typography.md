### Font Hierarchy
- Title/headline: fontSize 48-96, fontWeight "bold" or "900"
- Subtitle: fontSize 28-40, fontWeight "bold"
- Body text: fontSize 16-22, fontWeight "normal"
- Caption/small: fontSize 12-14, fontWeight "bold", opacity 0.7
- Oversized decorative text: fontSize 120-200, fontWeight "900", use for single words or numbers as visual anchors

### Font Pairing Rules
- Use maximum 2 fonts: one for headlines, one for body
- Recommended pairs:
  - Inter (body) + Playfair Display (headline)
  - Noto Sans TC (body) + Noto Serif TC (headline) [Chinese]
  - DM Sans (body) + Montserrat (headline)
- Available fonts: Inter, Arial, Playfair Display, Montserrat, DM Sans, Courier New, Noto Sans TC, Noto Serif TC

### Text Spacing
- lineHeight: 1.1-1.25 for headlines, 1.5-1.6 for body text
- charSpacing: negative values (-20) for large text, positive (50-100) for small uppercase labels
- For multi-line headlines, use lineHeight 1.0-1.25 to keep lines visually grouped
- Leave 20-40px vertical gap between headline and body text

### Text Contrast
- On dark backgrounds: fill "#ffffff" or "#f1f5f9"
- On light backgrounds: fill "#111827" or "#000000"
- For text over busy backgrounds, place a semi-transparent rect behind:
  { type: "rect", fill: "#000000", opacity: 0.5 } then text on top
- Never use pure gray text on colored backgrounds; tint the gray toward the background hue

### Text Decoration Techniques
- Underline accent: Use a rect element (height 3-4px) beneath a heading with an accent fill color
- Highlighted text: Place a rect with fill and opacity 0.3 behind the text
- For visual emphasis, use a contrasting fill color on key words (requires separate text elements)

### Responsive Text Sizing
- Scale all text proportionally to poster dimensions
- For 1080px wide poster: headline fontSize ~60, subtitle ~28, body ~18
- For 1920px tall story: headline fontSize 72-96 to fill the space
- Minimum readable size: fontSize 12 — never go smaller on posters
