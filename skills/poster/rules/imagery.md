### Decorative Shapes (CSS only, no images)
- Circle accents: <div class="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl -top-20 -right-20"></div>
- Geometric patterns: Use multiple small divs with border/bg colors
- Diagonal cuts: Use transform -skew-y-3 on a full-width div
- Dots pattern: Use radial-gradient for repeating dot backgrounds
- Ring/donut: <div class="absolute w-48 h-48 rounded-full border-4 border-pink-400/30 -bottom-10 -left-10"></div>
- Triangle: Use border trick — <div class="w-0 h-0 border-l-[50px] border-l-transparent border-b-[80px] border-b-amber-400 border-r-[50px] border-r-transparent"></div>
- Diamond: <div class="w-20 h-20 bg-cyan-400 rotate-45"></div>
- Starburst: Layer 2-3 rotated rectangles on top of each other with different rotation angles

### Background Techniques
- Solid + overlay: bg-slate-900 with colored shapes on top
- Gradient mesh: Multiple absolute positioned gradient circles with blur
  - Place 2-3 large (w-96 h-96) rounded-full divs with different colors and blur-3xl
  - Position them at different corners: -top-40 -left-40, -bottom-20 -right-40
  - This creates an organic, flowing background
- Noise texture: Not available in pure CSS, use subtle gradient patterns instead
- Glass effect: backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl
- Stripe pattern: Use repeating-linear-gradient:
  style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)"
- Grid pattern: Use repeating-linear-gradient for both horizontal and vertical lines:
  style="background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px)"
- Halftone dots:
  style="background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 12px 12px"

### SVG Decorations
- Simple icons inline: <svg viewBox="0 0 24 24" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2">...</svg>
- Star: <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill="currentColor" />
- Arrow: <path d="M5 12h14M12 5l7 7-7 7" />
- Decorative lines: <line x1="0" y1="0" x2="100" y2="0" stroke="white" opacity="0.3" />
- Wavy line: <path d="M0 10 Q 25 0, 50 10 T 100 10" stroke="white" fill="none" stroke-width="2" />
- Circle ornament: <circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" stroke-dasharray="5,5" />
- Wrap SVGs in a sized container: <div class="w-12 h-12 text-white"><svg ...></svg></div>

### Shadow & Depth
- Card elevation: shadow-lg or shadow-2xl
- Text depth: style="text-shadow: 0 4px 20px rgba(0,0,0,0.3)"
- Layered elements: Use z-10, z-20 for stacking
- Glow effects: shadow-[0_0_40px_rgba(139,92,246,0.3)] for colored glows
- Inner glow: Use box-shadow inset — style="box-shadow: inset 0 0 60px rgba(139,92,246,0.15)"
- Floating card effect: Combine shadow-2xl with a slight -translate-y-1 on hover-like styling
- Depth through color: Elements closer to viewer should be more saturated and brighter

### Divider & Separator Patterns
- Simple line: <div class="w-24 h-0.5 bg-white/30 mx-auto"></div>
- Dotted: <div class="w-32 border-t-2 border-dotted border-white/30 mx-auto"></div>
- Icon divider: Line + centered icon + line using flex:
  <div class="flex items-center gap-4"><div class="flex-1 h-px bg-white/20"></div><span>icon</span><div class="flex-1 h-px bg-white/20"></div></div>
- Gradient fade: <div class="w-48 h-px mx-auto" style="background: linear-gradient(to right, transparent, white, transparent)"></div>

### Border Treatments
- Subtle frame: border border-white/10 rounded-xl on a content container
- Double border: Use outline + border — border-2 border-white outline outline-2 outline-offset-4 outline-white/30
- Corner accents only: Use 4 small absolute-positioned L-shaped divs at corners
- Thick accent border: border-l-4 border-yellow-400 pl-4 for a left accent strip
