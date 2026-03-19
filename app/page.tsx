import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">VidCraft AI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-300 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            AI-Powered Video Generation
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Create Stunning Videos{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From script to screen in seconds. AI-powered video generation with custom animations,
            voiceover, and subtitles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-base hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25"
            >
              Start Creating
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-base hover:bg-zinc-700 hover:border-zinc-600 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Three powerful modes to bring your ideas to life
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Template Mode */}
          <div className="group rounded-2xl bg-zinc-900/50 border border-zinc-800 p-8 hover:border-purple-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Template Mode</h3>
            <p className="text-zinc-400 leading-relaxed">
              Choose from 9 scene types — charts, tables, stats, comparisons — AI generates the
              perfect script for your topic.
            </p>
          </div>

          {/* Creative Mode */}
          <div className="group rounded-2xl bg-zinc-900/50 border border-zinc-800 p-8 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Creative Mode</h3>
            <p className="text-zinc-400 leading-relaxed">
              AI writes custom React animations — stick figures, particle effects, SVG art. Unlimited
              creative possibilities.
            </p>
          </div>

          {/* Full Production */}
          <div className="group rounded-2xl bg-zinc-900/50 border border-zinc-800 p-8 hover:border-pink-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-500/15 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-400">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
                <rect x="1" y="6" width="14" height="12" rx="2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Full Production</h3>
            <p className="text-zinc-400 leading-relaxed">
              Auto voiceover (10+ voices), TikTok-style subtitles, transition effects, and HD cloud
              rendering.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Three simple steps to your finished video
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Enter Your Topic</h3>
              <p className="text-zinc-400">
                Enter your topic or paste content. The AI handles the rest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Generates Everything</h3>
              <p className="text-zinc-400">
                AI generates script, animations, voiceover &amp; subtitles automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Preview &amp; Download</h3>
              <p className="text-zinc-400">
                Preview, edit, and download your HD video. Ready to publish anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              9 Scene Types
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Every scene type you need for professional video content
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-800/10 border border-purple-500/20 p-5 text-center">
              <div className="text-2xl mb-2">🎬</div>
              <span className="text-sm font-medium text-purple-300">Title</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-800/10 border border-blue-500/20 p-5 text-center">
              <div className="text-2xl mb-2">📝</div>
              <span className="text-sm font-medium text-blue-300">Text</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-600/30 to-green-800/10 border border-green-500/20 p-5 text-center">
              <div className="text-2xl mb-2">📋</div>
              <span className="text-sm font-medium text-green-300">Bullets</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-500/20 p-5 text-center">
              <div className="text-2xl mb-2">📊</div>
              <span className="text-sm font-medium text-amber-300">Table</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-cyan-600/30 to-cyan-800/10 border border-cyan-500/20 p-5 text-center">
              <div className="text-2xl mb-2">📈</div>
              <span className="text-sm font-medium text-cyan-300">Chart</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-pink-600/30 to-pink-800/10 border border-pink-500/20 p-5 text-center">
              <div className="text-2xl mb-2">📉</div>
              <span className="text-sm font-medium text-pink-300">Stats</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-600/30 to-orange-800/10 border border-orange-500/20 p-5 text-center">
              <div className="text-2xl mb-2">⚖️</div>
              <span className="text-sm font-medium text-orange-300">Comparison</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-indigo-600/30 to-indigo-800/10 border border-indigo-500/20 p-5 text-center">
              <div className="text-2xl mb-2">💬</div>
              <span className="text-sm font-medium text-indigo-300">Quote</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-800/10 border border-emerald-500/20 p-5 text-center">
              <div className="text-2xl mb-2">👨‍💻</div>
              <span className="text-sm font-medium text-emerald-300">Code</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple Pricing
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Start free, scale as you grow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-8">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <div className="text-3xl font-bold mb-1">$0</div>
              <p className="text-sm text-zinc-500 mb-6">Forever free</p>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  30 credits / month
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  Template mode
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  720p rendering
                </li>
              </ul>
            </div>

            {/* T1 */}
            <div className="rounded-2xl bg-gradient-to-b from-blue-500/10 to-purple-500/5 border border-blue-500/30 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-semibold">
                Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">T1</h3>
              <div className="text-3xl font-bold mb-1">$5</div>
              <p className="text-sm text-zinc-500 mb-6">per month</p>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  200 credits / month
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  All modes + voiceover
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  1080p, no watermark
                </li>
              </ul>
            </div>

            {/* T2 */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-8">
              <h3 className="text-lg font-semibold mb-1">T2</h3>
              <div className="text-3xl font-bold mb-1">$20</div>
              <p className="text-sm text-zinc-500 mb-6">per month</p>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  1,000 credits / month
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  Priority rendering
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  Unlimited generations
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              View All Plans &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-sm text-zinc-400">
                VidCraft AI &mdash; Powered by Remotion + AWS Lambda
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/create" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Create
              </Link>
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Login
              </Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-xs text-zinc-600">
            &copy; 2026 VidCraft AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
