### Event Information Hierarchy
1. Event name (largest, most prominent)
2. Date and time (second most important)
3. Venue / location
4. Featured speakers/performers
5. Ticket info / CTA
6. Additional details (sponsors, hashtags)

Always maintain this priority order. If space is limited, cut from the bottom of the list first.

### Date/Time Formatting
- Large stylized date: Break into parts for visual impact
  <div class="text-7xl font-black">25</div>
  <div class="text-2xl uppercase tracking-widest">March 2026</div>
  <div class="text-lg font-light">7:00 PM - 10:00 PM</div>
- Calendar block style:
  <div class="bg-white text-black rounded-lg overflow-hidden w-24 text-center">
    <div class="bg-red-600 text-white text-xs py-1 uppercase font-bold">March</div>
    <div class="text-4xl font-black py-2">25</div>
  </div>
- Inline format for compact layouts: "March 25, 2026 | 7:00 PM"
- Use font-mono or tabular-nums for time displays to keep digits aligned
- Separate date components with a vertical line or dot: "SAT <span class="mx-2 text-yellow-400">|</span> MAR 25"

### Location Display
- Pin icon + address: flex items-start gap-2 with an SVG map pin
- Break address into two lines: venue name (font-bold) + street address (font-normal text-sm)
- For online events: Use a globe or screen icon + "Virtual Event" or "Live on Zoom"
- Add a subtle map-like decorative element or coordinates for visual interest:
  <div class="text-xs text-white/40 font-mono">25.0330 N, 121.5654 E</div>

### Speaker/Performer Lists
- Grid layout: grid grid-cols-2 or grid-cols-3
- Each card: Name (font-bold) + Title/Role (font-light text-sm) + optional emoji/icon
- Use alternating subtle bg colors for visual separation
- Featured speaker pattern:
  <div class="text-center">
    <div class="w-20 h-20 rounded-full bg-gray-600 mx-auto mb-3"></div>
    <div class="font-bold">Speaker Name</div>
    <div class="text-sm text-gray-400">Company / Title</div>
  </div>
- For headliners, make them 2x the size of other performers
- Use a "featuring" or "special guest" label in text-xs uppercase tracking-widest above the name

### Schedule/Agenda
- Timeline layout: Use border-l-2 with dots for timeline
  <div class="border-l-2 border-cyan-400 pl-6 space-y-6">
    <div class="relative">
      <div class="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-cyan-400"></div>
      <div class="text-sm text-cyan-400 font-mono">09:00</div>
      <div class="font-semibold">Opening Keynote</div>
      <div class="text-sm text-gray-400">Speaker Name</div>
    </div>
  </div>

- Table layout: grid grid-cols-[auto_1fr] gap-x-6 gap-y-3
- Time on left (font-mono, text-sm, text-accent-color), content on right
- Add horizontal lines or alternating backgrounds for readability in long schedules
- Group morning/afternoon/evening with subtle section headers

### CTA (Call to Action)
- Prominent button-like element at bottom
- Use contrasting color: bg-yellow-400 text-black or bg-white text-gray-900
- Text: "Register Now", "Get Tickets", "RSVP", "Learn More"
- Add subtle arrow or external link icon
- CTA button styling:
  <div class="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-full text-lg uppercase tracking-wide">
    Get Tickets &rarr;
  </div>
- Alternative: Ghost/outline button for secondary actions:
  <div class="inline-block border-2 border-white text-white font-semibold px-6 py-2 rounded-full">
    Learn More
  </div>
- For urgency: Add a small label above CTA: "Limited Seats" or "Early Bird Ends March 20"

### Ticket/Pricing Info
- Pricing display pattern:
  <div class="text-center">
    <div class="text-sm uppercase tracking-widest text-gray-400">Starting from</div>
    <div class="text-5xl font-black">$49</div>
    <div class="text-sm text-gray-400">per person</div>
  </div>
- Multiple tiers: Use grid grid-cols-3 with cards, highlight the middle/recommended tier
- Free events: Emphasize "FREE" in large bold text with an accent color

### Brand & Sponsor Section
- Place at the very bottom in smaller text
- Sponsor logos as text: "Presented by" + names in font-semibold
- Use flex items-center justify-center gap-8 for a row of sponsor names
- Separate from main content with a subtle divider: <div class="w-16 h-px bg-white/20 mx-auto my-6"></div>
- Social media handles: Use @ prefix, text-sm, and a platform icon or emoji

### Event Type Templates
- Conference: Emphasize speakers + schedule, professional blue/slate tones
- Concert/Music: Bold typography, dark bg, neon accents, performer names large
- Workshop: Highlight what attendees will learn, include bullet points, warm inviting tones
- Webinar: Clean minimal design, speaker photo area, registration CTA prominent
- Fundraiser/Gala: Elegant serif fonts, gold/black palette, formal tone
- Meetup/Social: Casual, friendly colors, community-focused language
