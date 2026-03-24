### Poster Layout Patterns
- Centered hero: Stack text elements vertically centered on the canvas
- Split layout: Place content in two halves using left/width calculations (left half 0 to width/2, right half width/2 to width)
- Top-heavy: Large headline in upper third, details in lower third
- Full bleed: Background fills entire canvas, text overlaid with padding from edges
- Diagonal split: Use a rotated rect element to create an angled divider
- L-shaped: One tall element on the left, stacked content on the right

### Spacing System
- Edge padding: 48-60px from each edge for 1080px posters, 60-80px for larger
- Section spacing: 40-60px between major content groups
- Element spacing: 12-20px between items within a group
- Never place text within 5% of edges
- For 1920px tall story posters, use 80-100px top/bottom padding
- Group related items tightly (12-16px gap), separate groups generously (48px+)

### Alignment
- Center-align (textAlign: "center") for announcements, events, quotes
- Left-align (textAlign: "left") for information-heavy posters
- Align elements by matching their "left" values for vertical alignment
- Don't mix left and center alignment in the same section
- When center-aligning, set text element width and use textAlign "center"

### Visual Hierarchy (Z-Pattern)
1. Top-left: Logo or brand mark (small text element)
2. Top-right: Date or category
3. Center: Main message (largest fontSize, bold)
4. Bottom: Call to action, details, contact info

### F-Pattern (for text-heavy posters)
1. Top full width: Headline text spanning the poster width
2. Left-aligned subheadings below
3. Body text left-aligned for easy scanning
4. Use bold fontWeight or accent fill colors to create scan points

### Element Layering
- Elements array order = z-index: first = bottom, last = top
- Background decorations (low-opacity circles/rects) → placed first in array
- Content rects (card backgrounds, CTA buttons) → middle
- Text elements → last in array (on top)

### Whitespace as a Design Element
- Empty space draws attention to existing content — do not fill every pixel
- Leave at least 30% of poster as breathing room for elegant designs
- Dense posters (events, menus) can go down to 15% whitespace but no less
- Use generous spacing between groups rather than divider lines
