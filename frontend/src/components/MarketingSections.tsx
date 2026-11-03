import { Check, Cloud, Database, GitBranch, Mail, Network, ShieldCheck, Workflow } from 'lucide-react';

const sectionClass = 'scroll-mt-24 border-t border-zinc-900 px-6 py-20 sm:px-10 lg:px-16';
const cardClass = 'rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6';

export type MarketingSectionId = 'features' | 'how-it-works' | 'integrations' | 'pricing';
export function MarketingSections({ section }: { section: MarketingSectionId }) {
  return <div className="bg-black text-white">
    {section === 'features' && <section className={sectionClass}>
      <SectionHeading eyebrow="Capabilities" title="A workflow engine built for careful automation." description="AgentFlow turns ambiguous work into visible, reviewable steps—without turning product discovery into a dashboard." />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        <InfoCard icon={<Network />} title="Specialist agent teams" text="Plan, research, analyze, validate, and report with clear responsibilities at every stage." />
        <InfoCard icon={<ShieldCheck />} title="Approval controls" text="Set human review gates for consequential actions before they are carried out." />
        <InfoCard icon={<Workflow />} title="Traceable execution" text="Follow each workflow from its original objective to its final deliverable and audit trail." />
      </div>
    </section>}
    {section === 'how-it-works' && <section className={sectionClass}>
      <SectionHeading eyebrow="Workflow" title="From objective to verified outcome." description="A simple sequence for users, supported by a coordinated orchestration layer behind the scenes." />
      <ol className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4">
        {['Describe your goal', 'Review the plan', 'Agents coordinate work', 'Approve and deliver'].map((title, index) => <li key={title} className={cardClass}><span className="mb-6 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm font-semibold">0{index + 1}</span><h3 className="text-base font-medium">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">{['Start with an outcome in plain language.', 'See the work broken into accountable steps.', 'Specialized agents execute with shared context.', 'Keep control at the important decision points.'][index]}</p></li>)}
      </ol>
    </section>}
    {section === 'integrations' && <section className={sectionClass}>
      <SectionHeading eyebrow="Connected tools" title="Work with the systems your team already uses." description="Integrations bring context to a workflow; they do not grant access from this marketing page." />
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={<GitBranch />} title="GitHub" text="Turn engineering context into reviewable workflow steps." />
        <InfoCard icon={<Mail />} title="Gmail" text="Prepare communications with explicit approval gates." />
        <InfoCard icon={<Cloud />} title="Cloud APIs" text="Coordinate cloud actions with visibility and controls." />
        <InfoCard icon={<Database />} title="Data services" text="Bring trusted sources into research and reporting." />
      </div>
    </section>}
    {section === 'pricing' && <section className={sectionClass}>
      <SectionHeading eyebrow="Pricing" title="Plans that scale with your workflow volume." description="Monthly pricing is informational. Choose a plan after signing in with an approved account." />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
        <PriceCard name="Starter" price="$29" detail="For individual automation" features={['100 workflow runs / month', '3 connected tools', 'Standard support']} />
        <PriceCard name="Team" price="$99" detail="For collaborative operations" featured features={['1,000 workflow runs / month', '10 connected tools', 'Approval workflows', 'Priority support']} />
        <PriceCard name="Enterprise" price="Custom" detail="For governed scale" features={['Custom usage limits', 'Private integrations', 'Advanced controls', 'Dedicated support']} />
      </div>
    </section>}
  </div>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mx-auto mb-10 max-w-6xl"><p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">{description}</p></div>; }
function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className={cardClass}><span className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200">{icon}</span><h3 className="text-base font-medium">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p></article>; }
function PriceCard({ name, price, detail, features, featured = false }: { name: string; price: string; detail: string; features: string[]; featured?: boolean }) { return <article className={`${cardClass} ${featured ? 'border-zinc-500 shadow-[0_0_30px_rgba(255,255,255,0.07)]' : ''}`}><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{name}</h3>{featured && <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">Popular</span>}</div><p className="mt-4 text-3xl font-semibold">{price}{price.startsWith('$') && <span className="text-sm font-normal text-zinc-500"> / month</span>}</p><p className="mt-2 text-sm text-zinc-400">{detail}</p><ul className="mt-6 space-y-3 text-sm text-zinc-300">{features.map((feature) => <li className="flex gap-2" key={feature}><Check className="h-4 w-4 shrink-0 text-zinc-400" />{feature}</li>)}</ul><div className="mt-7 flex h-10 items-center justify-center rounded-lg border border-zinc-700 text-sm text-zinc-400">Available after sign in</div></article>; }
