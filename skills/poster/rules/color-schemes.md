### Palette Construction
- Use 1 primary color, 1 accent color, and 1 neutral (background)
- Color families:
  - Warm: #f43f5e (rose), #f97316 (orange), #f59e0b (amber), #eab308 (yellow)
  - Cool: #3b82f6 (blue), #06b6d4 (cyan), #14b8a6 (teal), #10b981 (emerald)
  - Neutral: #64748b (slate), #71717a (zinc), #6b7280 (gray), #78716c (stone)
  - Vibrant: #8b5cf6 (purple), #ec4899 (pink), #6366f1 (indigo), #7c3aed (violet)
- Limit to 3-4 distinct colors per poster for cohesion
- Use lighter/darker shades of the same hue for depth

### Gradient Patterns
- Hero backgrounds: "linear-gradient(135deg, #1e40af 0%, #1e3a5f 50%, #0f172a 100%)"
- Subtle overlays: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)"
- Accent gradients: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)"
- Gradient direction meanings:
  - 180deg (top to bottom): calm, settled, natural
  - 135deg (diagonal): dynamic, forward motion
  - 90deg (left to right): progression, timeline

### Mood-Based Color Selection
- Professional: background "#1e3a5f", accent "#3b82f6", text "#ffffff"
- Creative: background "#2e1065", accent "#ec4899", highlight "#facc15"
- Elegant: background "#000000", accent "#f59e0b" (gold), text "#ffffff"
- Nature: background "#064e3b", accent "#10b981", highlight "#f59e0b"
- Tech: background "#0f172a", accent "#06b6d4", text "#e2e8f0"
- Urgent/sale: background "#000000", accent "#dc2626", highlight "#facc15"
- Calm: background "#0f766e", accent "#67e8f9", text "#ffffff"
- Food: background "#7c2d12", accent "#f97316", text "#fef3c7"
- Music: background "#1e1b4b", accent "#c084fc", highlight "#f0abfc"
- Education: background "#1e3a5f", accent "#3b82f6", highlight "#fbbf24"

### Contrast Rules
- WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text
- Never use light text on light background or dark on dark
- White text works on any background darker than ~#555555
- Use rect elements with opacity 0.4-0.6 behind text for readability on complex backgrounds

### Color Application Strategy
- Background: Use darkest/lightest shade — should not compete with content
- Primary text: fill "#ffffff" on dark, "#111827" on light
- Accent: Use sparingly on CTA rects, decorative lines, or small elements
- Never apply accent to more than 10-15% of poster area
- Use low opacity (0.1-0.2) on large decorative circles/rects
