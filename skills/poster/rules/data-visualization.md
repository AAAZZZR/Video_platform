### Statistics Display
- Big number + label pattern:
  <div class="text-6xl font-bold">95%</div>
  <div class="text-sm uppercase tracking-widest mt-2">Customer Satisfaction</div>
- Side by side stats: grid grid-cols-3 gap-8 text-center
- Use a contrasting color or font-weight for the number vs. the label
- Add a subtle top border or icon above each stat for visual grouping:
  <div class="border-t-2 border-cyan-400 pt-4">...</div>
- For currency/large numbers, use font-tabular-nums for aligned digits
- Animate perception: Use a gradient or accent color on the number to draw the eye first

### Progress Bars
- Container: <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
- Fill: <div class="h-full bg-blue-500 rounded-full" style="width: 75%"></div>
- Add label above or inside the bar
- Striped fill: style="background: repeating-linear-gradient(45deg, #3b82f6, #3b82f6 10px, #2563eb 10px, #2563eb 20px)"
- Segmented progress: Use flex with gap-1 and multiple colored segments
- Label pattern:
  <div class="flex justify-between text-sm mb-1">
    <span>Progress</span>
    <span>75%</span>
  </div>
  followed by the bar

### Comparison Layout
- Two columns with vs divider:
  grid grid-cols-2 with an absolute positioned "VS" in the center
- Before/After: Side by side with contrasting colors (red-500 left, green-500 right)
- Use consistent formatting on both sides so differences are immediately visible
- Highlight the winner/better side with a subtle ring or glow:
  ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900
- Table comparison: grid with alternating row backgrounds for readability

### Simple Charts (CSS only)
- Horizontal bar chart:
  <div class="flex items-center gap-3 mb-3">
    <div class="w-20 text-sm text-right">Sales</div>
    <div class="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
      <div class="h-full bg-blue-500 rounded-full" style="width: 85%"></div>
    </div>
    <div class="w-12 text-sm">85%</div>
  </div>

- Vertical bar/column chart:
  <div class="flex items-end gap-3 h-48">
    <div class="flex-1 flex flex-col items-center">
      <div class="w-full bg-blue-500 rounded-t" style="height: 80%"></div>
      <div class="text-xs mt-2">Q1</div>
    </div>
    <!-- repeat for each bar -->
  </div>

- Pie/donut chart using conic-gradient:
  <div class="w-40 h-40 rounded-full" style="background: conic-gradient(#3b82f6 0% 45%, #f59e0b 45% 75%, #ef4444 75% 100%)"></div>
  For a donut, add an inner circle: Place a smaller bg-matching circle absolutely centered inside

- Stacked bar: Single bar with multiple colored segments using flex:
  <div class="flex h-6 rounded-full overflow-hidden">
    <div class="bg-blue-500" style="width: 45%"></div>
    <div class="bg-amber-500" style="width: 30%"></div>
    <div class="bg-red-500" style="width: 25%"></div>
  </div>

### Chart Legends
- Place legend below the chart with flex flex-wrap gap-4
- Each item: <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-blue-500"></div><span class="text-sm">Label</span></div>
- Keep legend items on one line when possible for clean layout
- Match legend colors exactly to chart segment colors

### Icon + Number Combos
- Use emoji or inline SVG as icons next to statistics
- Place icon left, text right: flex items-center gap-3
- Or icon on top, text below: flex flex-col items-center
- Size icons proportionally: if the number is text-4xl, icon should be w-10 h-10 or similar
- Common emoji icons for stats: fire for trending, chart for growth, check for completed, star for rating, users for audience

### Ranking / Leaderboard
- Numbered list with visual weight decreasing:
  - #1: text-2xl, bg accent color, full width
  - #2: text-xl, lighter bg
  - #3 and below: text-lg, minimal styling
- Use a left border color to indicate rank: border-l-4 border-yellow-400 for #1, border-gray-400 for #2
- Show rank number in a circle: w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold

### Timeline / Process Steps
- Horizontal: flex with connecting lines between circles
  <div class="flex items-center">
    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
    <div class="flex-1 h-0.5 bg-blue-300"></div>
    <!-- next step -->
  </div>
- Vertical: Use border-l-2 as the spine with absolutely positioned dots:
  <div class="border-l-2 border-blue-500 pl-8 space-y-8 relative">
    <div class="relative">
      <div class="absolute -left-[41px] w-4 h-4 rounded-full bg-blue-500"></div>
      <div>Step content here</div>
    </div>
  </div>
