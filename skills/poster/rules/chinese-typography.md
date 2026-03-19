### CJK Font Loading
- Always load CJK fonts explicitly via Google Fonts:
  <style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap');</style>
  <style>@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap');</style>
- CJK font files are large. Always include &display=swap to prevent invisible text during load.
- Load only the weights you actually use to minimize load time.

### Recommended Font Families
- Traditional Chinese: Noto Sans TC, Noto Serif TC
- Simplified Chinese: Noto Sans SC, Noto Serif SC
- Japanese: Noto Sans JP, Noto Serif JP
- Korean: Noto Sans KR, Noto Serif KR
- Apply via: style="font-family: 'Noto Sans TC', sans-serif"
- For a modern feel: Use Noto Sans (clean, geometric)
- For a traditional/elegant feel: Use Noto Serif (brush-stroke influenced)
- Pair Noto Serif for headlines with Noto Sans for body text within the same language

### CJK Text Sizing
- Chinese characters are visually wider and denser than Latin letters — reduce font size by ~10-15%
- If Latin uses text-5xl, Chinese should use text-4xl
- Line height should be slightly larger: leading-loose (2) for dense CJK text
- For single-line headlines, leading-tight is acceptable
- Minimum readable size for CJK text: text-sm (14px) — characters become indistinct below this
- For body paragraphs in Chinese, text-base (16px) to text-lg (18px) with leading-relaxed to leading-loose
- Character density: A Chinese sentence conveys more meaning per character than English, so fewer characters fill the same visual space

### Mixed Language Layout
- When mixing Chinese and English:
  - Keep headings in one language
  - Use English for labels/categories, Chinese for main content (or vice versa)
  - Don't switch languages mid-sentence
  - English text within Chinese needs slightly different vertical alignment
- Common bilingual patterns:
  - Chinese headline above, English subtitle below (or vice versa)
  - English brand name / Chinese tagline
  - Chinese body text with English technical terms wrapped in <span style="font-family: 'Inter', sans-serif">
- Set the primary language font on the container, override for the secondary language on specific elements

### Punctuation
- Use full-width punctuation for Chinese text: ， 。 ！ ？ ： ；
- Don't add spaces before/after Chinese punctuation
- Use <span class="tracking-normal"> to reset any letter-spacing on CJK text
- Common full-width marks:
  - Comma: ，(not ,)
  - Period: 。(not .)
  - Question: ？(not ?)
  - Exclamation: ！(not !)
  - Colon: ：(not :)
  - Quotation: 「」or『』(not "" or '')
- When a line contains both Chinese and English, use the punctuation style of the surrounding language

### Vertical Text (when needed)
- Use writing-mode: vertical-rl for traditional vertical Chinese
- Apply via inline style: style="writing-mode: vertical-rl"
- Good for decorative elements, traditional poster aesthetics, side labels
- Vertical text reads top-to-bottom, right-to-left in traditional Chinese
- Combine with a fixed height container to control column wrapping
- Example:
  <div style="writing-mode: vertical-rl; height: 300px;" class="text-2xl font-serif leading-loose tracking-widest">
    traditional vertical text here
  </div>
- Use sparingly: vertical text is a decorative choice, not the default for modern posters

### Chinese-Specific Layout Tips
- Chinese text does not have natural word breaks — the browser may break at any character
- For headlines, avoid awkward breaks by placing each logical phrase in its own <div>
- Do not use text-justify on short Chinese text blocks — it creates uneven character spacing
- For emphasis, use font-bold or a colored <span> instead of italics (italics look unnatural on CJK characters)
- Underline works for emphasis: <span class="underline decoration-yellow-400 decoration-2 underline-offset-4">keyword</span>

### Number and Date Formatting
- Chinese dates: 2026年3月25日 (year-month-day with characters)
- Chinese time: 下午 7:00 or 19:00
- Chinese currency: NT$490 or ¥49 or $49 USD (depending on region)
- Large numbers in Chinese: 1萬 (10,000), 10萬 (100,000), 100萬 (1,000,000)
- Use Arabic numerals (1, 2, 3) in modern poster designs; reserve Chinese numerals (一, 二, 三) for traditional/formal contexts

### Common Chinese Poster Phrases
- Event: 活動, 講座, 工作坊, 研討會
- CTA: 立即報名, 了解更多, 免費參加, 馬上預約
- Date/Time labels: 日期, 時間, 地點
- Urgency: 限時, 名額有限, 即將截止, 最後機會
- Use these as reference; always defer to the user's actual content and language preference
