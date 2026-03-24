### Big Number Display
- Large stat value: text element with fontSize 56-80, fontWeight "bold"
- Label below: text element with fontSize 14-18, opacity 0.7
- Place multiple stats side by side with equal horizontal spacing
- Add a small decorative line or rect as accent between stat pairs

### Bar Chart Pattern
- Use rect elements with varying heights arranged horizontally
- Base: all rects share the same bottom edge (calculate top = chartBottom - barHeight)
- Labels below each bar: text elements at fontSize 12-14
- Value labels above each bar: text elements at fontSize 14-16
- Color: use accent color for bars, lower opacity for background bar outline
- Example bar: { type: "rect", left: 100, top: 400, width: 60, height: 200, fill: "#3b82f6", rx: 4, ry: 4 }

### Progress Bar Pattern
- Background bar: { type: "rect", width: 600, height: 16, fill: "#334155", rx: 8, ry: 8 }
- Fill bar (on top): { type: "rect", width: 420, height: 16, fill: "#3b82f6", rx: 8, ry: 8 }
- Percentage label: text element next to the bar

### Comparison Layout
- Two columns with a vertical line divider in the center
- Left column: "Before" / "Option A" items
- Right column: "After" / "Option B" items
- Use contrasting colors for each side (e.g., #ef4444 vs #10b981)

### Ranking / Leaderboard
- Numbered list using text elements with consistent left alignment
- Horizontal rect bars sized proportionally to values
- Medal/rank indicators: circle elements with different fills (#f59e0b gold, #94a3b8 silver, #b45309 bronze)

### Timeline
- Vertical line: { type: "line", x1: centerX, y1: top, x2: centerX, y2: bottom, stroke: "#475569", strokeWidth: 2 }
- Circle nodes at each date point: { type: "circle", radius: 8, fill: accent }
- Date + description text on alternating sides
