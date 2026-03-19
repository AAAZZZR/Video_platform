### Poster Layout Patterns
- Centered hero: items-center justify-center with stacked text
- Split layout: grid grid-cols-2 for side-by-side content
- Top-heavy: Large headline at top, details at bottom
- Card grid: grid grid-cols-2 gap-4 or grid-cols-3 for multiple items
- Full bleed: Single powerful visual with overlaid text
- Diagonal split: Use a skewed div to divide the poster into two angled sections
- Overlapping sections: Use negative margins (-mt-12) or absolute positioning to create overlap between content blocks
- L-shaped layout: One tall column on the left + stacked content on the right using grid grid-cols-[1fr_2fr]

### Spacing System
- Use consistent padding: p-8 for small posters, p-12 to p-16 for large
- Section spacing: space-y-6 or space-y-8 between major blocks
- Element spacing: space-y-2 or space-y-3 within groups
- Edge breathing room: never place text within 5% of edges
- For 1080px wide posters, p-12 (48px) provides good edge margins
- For 1920px tall story posters, use pt-20 pb-16 for vertical breathing room
- Group related items with tight spacing (gap-2), separate unrelated groups with generous spacing (gap-8 or more)

### Alignment
- Center-align for announcements, events, quotes
- Left-align for information-heavy posters (schedules, lists)
- Use flex items-center justify-center for centering
- Consistent alignment: don't mix left and center in the same section
- Right-align is rarely used as the primary alignment; reserve it for secondary details like dates or page numbers
- When center-aligning text, keep line length short (max 30-40 characters) to avoid awkward ragged edges

### Visual Hierarchy (Z-Pattern)
1. Top-left: Logo or brand mark
2. Top-right: Date or category
3. Center: Main message (largest, boldest)
4. Bottom: Call to action, details, contact info

### F-Pattern (for text-heavy posters)
1. Top full width: Headline
2. Left side scan: Subheadings, bullet points
3. Left-to-right reading for each line of content
4. Use bold or color to create scan points along the left edge

### Grid Usage
- 12-column mental grid: items should span 4, 6, 8, or 12 columns
- Use gap-4 to gap-8 between grid items
- Asymmetric grids (e.g., 1fr 2fr) create dynamic layouts
- For posters, prefer 2 or 3 column grids — more columns become too complex
- Use grid-rows-[auto_1fr_auto] for header-content-footer structure

### Container Structure
- Always wrap the entire poster in a single root div with explicit width/height:
  <div class="relative w-full h-full overflow-hidden bg-slate-900">
- Use relative on the root and absolute on decorative elements
- Set overflow-hidden on the root to prevent decorative shapes from expanding the canvas
- Layer content with z-index: decorative shapes (z-0), background overlays (z-10), text content (z-20)

### Whitespace as a Design Element
- Empty space draws attention to the content that exists — do not fill every pixel
- Leave at least 30% of the poster as breathing room for elegant designs
- Dense posters (events, menus) can go down to 15% whitespace but no less
- Cluster information into clear groups separated by generous whitespace rather than using divider lines

### Poster Size Templates
- Square (Instagram post): w-[1080px] h-[1080px]
- Portrait (Instagram story): w-[1080px] h-[1920px]
- Landscape (presentation): w-[1920px] h-[1080px]
- A4 proportions: w-[794px] h-[1123px]
- Cinematic wide: w-[1920px] h-[800px]
