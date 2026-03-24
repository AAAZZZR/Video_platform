### Decorative Elements
- Use circle elements with low opacity (0.1-0.2) as abstract background accents
- Use rect elements with rounded corners (rx/ry) for card-like sections
- Use line elements as dividers or decorative strokes
- Layer multiple semi-transparent shapes for depth

### Background Accents
- Large circle blobs: { type: "circle", radius: 200-400, fill: accent color, opacity: 0.1-0.15 }
- Place circles partially off-canvas (negative left/top) for organic feel
- Overlapping circles of different sizes create visual interest
- Use 2-3 accent circles maximum to avoid clutter

### Geometric Patterns
- Horizontal/vertical line grids: series of line elements with consistent spacing
- Diagonal lines: use angle property on rect elements
- Dot pattern: array of small circles at regular intervals (use sparingly)

### Card/Container Patterns
- Dark card on dark bg: { type: "rect", fill: "#1e293b", opacity: 0.6, rx: 16, ry: 16 }
- Light card on light bg: { type: "rect", fill: "#ffffff", opacity: 0.8, rx: 12, ry: 12 }
- Place text elements inside (on top of) card rects for grouped content

### Shadow and Depth
- Create depth by layering darker rects behind lighter ones with slight offset
- Use graduated opacity: background shapes at 0.1, mid-ground at 0.3, foreground at 1.0
- Subtle border effect: rect with stroke color and strokeWidth 1-2, no fill

### CRITICAL: No External Images
- Do not reference any image URLs or SVG inline markup
- All visuals must use rect, circle, and line primitives
- Use emoji sparingly as text elements for small icons
