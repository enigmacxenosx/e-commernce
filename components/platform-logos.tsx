import { ArrowUpRight, Check } from "lucide-react"

const platforms = [
  { name: "Jumia", mark: "J", color: "bg-[#ff8a3d]", note: "Everyday essentials" },
  { name: "Kilimall", mark: "K", color: "bg-[#ff5f6d]", note: "Value hunters" },
  { name: "Jiji", mark: "J", color: "bg-[#43c78b]", note: "Local finds" },
]

export function PlatformLogos() {
  return (
    <section className="border-b border-[#102235]/10 bg-[#f8f3e9] py-8 dark:border-white/10 dark:bg-[#132437]">
      <div className="site-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3677ff]">Market coverage</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#536476] dark:text-[#b6c3cf]">We compare the places Kenyans already shop, so you can pick the best move faster.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {platforms.map((platform) => (
              <div key={platform.name} className="group flex min-w-[190px] items-center gap-3 rounded-2xl border border-[#102235]/10 bg-white/60 px-3 py-3 transition-colors hover:border-[#3677ff]/50 dark:border-white/10 dark:bg-white/5">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${platform.color} text-lg font-black text-white shadow-sm`}>{platform.mark}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-black text-[#102235] dark:text-[#f5f0e6]">{platform.name}<ArrowUpRight className="h-3 w-3 opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  <span className="block text-[11px] text-[#718092] dark:text-[#aebdca]">{platform.note}</span>
                </span>
                <Check className="ml-auto h-4 w-4 text-[#3677ff]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
