import { useState } from 'react'
import { APP_URL, displayFont, sansFont, PURPLE, TEAL, AMBER, SURFACE, MUTED, ADULT_URL } from '../constants'
import { KIDS_MODULES, type KidsModule } from '../data/kidsModules'
import FadeIn from '../components/FadeIn'

function ModuleCard({ mod }: { mod: KidsModule }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: '#fff',
        border: open ? `2px solid ${mod.color}` : '2px solid rgba(0,0,0,0.06)',
        boxShadow: open ? `0 8px 32px -8px ${mod.color}33` : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-3xl">{mod.emoji}</span>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ ...sansFont, backgroundColor: `${mod.color}18`, color: mod.color }}
          >
            {open ? 'Close ↑' : 'Explore ↓'}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ ...displayFont, color: '#18181B' }}>
          {mod.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ ...sansFont, color: MUTED }}>
          {mod.tagline}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {mod.vocab.slice(0, 4).map(v => (
            <span
              key={v.en}
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ ...sansFont, backgroundColor: `${mod.color}14`, color: mod.color, border: `1px solid ${mod.color}30` }}
            >
              {v.en}
            </span>
          ))}
          {!open && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ ...sansFont, color: MUTED }}>
              +{mod.vocab.length - 4} more
            </span>
          )}
        </div>
      </div>

      {open && (
        <div className="px-6 pb-6 border-t" style={{ borderColor: `${mod.color}20` }} onClick={e => e.stopPropagation()}>
          <p className="text-xs uppercase tracking-widest mt-5 mb-3 font-bold" style={{ ...sansFont, color: MUTED }}>
            Vocabulary
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-5">
            {mod.vocab.map(v => (
              <div key={v.en} className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold" style={{ ...sansFont, color: '#18181B' }}>{v.en}</span>
                <span className="text-sm font-semibold text-right" style={{ ...sansFont, color: mod.color }}>{v.es}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: `${mod.color}0d`, border: `1px solid ${mod.color}25` }}>
            <p className="text-xs uppercase tracking-widest mb-2 font-bold" style={{ ...sansFont, color: mod.color }}>
              Sample sentence
            </p>
            <p className="text-sm font-semibold leading-relaxed mb-1" style={{ ...sansFont, color: '#18181B' }}>
              "{mod.samplePhrase.en}"
            </p>
            <p className="text-sm leading-relaxed" style={{ ...sansFont, color: MUTED }}>
              "{mod.samplePhrase.es}"
            </p>
          </div>

          <div className="rounded-xl p-3 mb-5" style={{ backgroundColor: '#F0EDE6' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ ...sansFont, color: MUTED }}>💡 Fun fact</p>
            <p className="text-xs leading-relaxed" style={{ ...sansFont, color: '#18181B' }}>{mod.funFact}</p>
          </div>

          <a
            href={`${APP_URL}?module=${mod.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
            style={{ ...sansFont, backgroundColor: mod.color, color: '#fff' }}
          >
            Practice {mod.title} →
          </a>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="min-h-screen flex flex-col justify-center relative overflow-hidden"
        style={{ paddingTop: 120, paddingBottom: 80, backgroundColor: '#FDFCF9' }}
      >
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute top-20 right-0 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="pointer-events-none absolute bottom-20 left-0 w-80 h-80 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${TEAL}, transparent)` }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ backgroundColor: `${PURPLE}14`, border: `1px solid ${PURPLE}25` }}>
              <span className="text-sm font-bold" style={{ ...sansFont, color: PURPLE }}>For Ages 7–14 · Homeschool Friendly</span>
            </div>

            <h1
              className="leading-[1.1] mb-6"
              style={{ ...displayFont, fontSize: 'clamp(2.6rem, 6vw, 5rem)', color: '#18181B' }}
            >
              Your child's first<br />
              <em style={{ color: PURPLE }}>second language.</em>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed mb-4" style={{ ...sansFont, color: MUTED, fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              Nine topics built around the world kids actually care about — animals, sports, science, food,
              travel, and more. An AI practice partner that talks back, asks questions, and makes it real.
              No worksheets. No memorizing lists.
            </p>

            <p className="max-w-xl text-base leading-relaxed mb-10" style={{ ...sansFont, color: '#71717A' }}>
              The same AI engine used by nurses, surgeons, and construction foremen — built from the ground
              up for curious kids and the families teaching them at home.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90"
                style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
              >
                Start Learning — It's Free →
              </a>
              <a
                href="#modules"
                className="px-8 py-4 rounded-full font-bold text-base transition-opacity hover:opacity-80"
                style={{ ...sansFont, color: '#18181B', border: '2px solid rgba(0,0,0,0.12)' }}
              >
                See All Topics ↓
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <FadeIn>
        <section className="py-20" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { stat: '7–14', label: 'The prime window for second language acquisition — children in this range absorb language faster than at any other time in life', source: 'Cognitive science research' },
                { stat: '20+', label: 'Countries where Spanish is the official language — the most useful second language a child can learn in the Americas', source: 'United Nations' },
                { stat: 'Weeks', label: 'not years — to reach conversational basics when vocabulary is connected to topics the learner genuinely cares about', source: 'Junior Linguist method' },
              ].map(item => (
                <div key={item.stat} className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{ ...displayFont, color: PURPLE }}>
                    {item.stat}
                  </div>
                  <p className="text-sm leading-relaxed mb-1" style={{ ...sansFont, color: '#18181B' }}>{item.label}</p>
                  <p className="text-xs font-semibold" style={{ ...sansFont, color: MUTED }}>{item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Module magazine */}
      <section id="modules" className="py-28" style={{ backgroundColor: '#FDFCF9' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${PURPLE}14` }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ ...sansFont, color: PURPLE }}>Nine topics</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ ...displayFont, color: '#18181B' }}>
              Their world.<br />
              <em style={{ color: PURPLE }}>Their vocabulary.</em>
            </h2>
            <p className="max-w-2xl text-base leading-relaxed mb-16" style={{ ...sansFont, color: MUTED }}>
              Click any topic to see the vocabulary, read a sample sentence, and start an AI practice session.
              Every module is built around things kids already know and love — so new words stick.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {KIDS_MODULES.map((mod, i) => (
              <FadeIn key={mod.id} delay={i * 40}>
                <ModuleCard mod={mod} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Homeschool section */}
      <FadeIn>
        <section id="homeschool" className="py-24" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-3xl mx-auto px-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold" style={{ ...sansFont, color: TEAL }}>
              Built for homeschoolers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-8" style={{ ...displayFont, color: '#18181B' }}>
              A language curriculum<br />
              <em style={{ color: TEAL }}>that does the talking.</em>
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ ...sansFont, color: '#3F3F46' }}>
              <p>
                Homeschool families need a language curriculum that is self-directed, engaging, and actually
                teaches the child to speak — not just fill in blanks. Junior Linguist is built around
                AI conversation practice, which means your child gets a patient, tireless partner who will
                ask questions, correct gently, and meet them exactly where they are.
              </p>
              <p>
                The nine topic modules map naturally onto typical middle-grade curriculum areas: science,
                social studies, arts, health, and geography. A student working through the Animals & Nature
                module is also building science vocabulary. The Travel & Places module reinforces world
                geography. The Family & Home module introduces cultural context alongside language.
              </p>
              <p style={{ color: '#18181B', fontWeight: 600 }}>
                There is no separate teacher setup required. Your child opens the app, picks a topic, and
                starts talking. You can review their progress, add it to your lesson plans, or simply let
                curiosity lead.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* How it works */}
      <section className="py-24" style={{ backgroundColor: '#FDFCF9' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center" style={{ ...displayFont, color: '#18181B' }}>
              How Junior Linguist works
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', color: PURPLE, title: 'Pick a topic you love', body: 'Animals, sports, food, science — start with whatever your child is already excited about. Vocabulary sticks when it connects to something real.' },
              { step: '02', color: TEAL, title: 'Talk to the AI', body: 'The AI partner asks questions, reacts to answers, and gently guides the conversation. It sounds like a real exchange, not a worksheet.' },
              { step: '03', color: AMBER, title: 'Use it by next week', body: 'Short daily sessions beat one long weekly lesson. Ten minutes a day, five days a week — most kids are holding simple conversations within a month.' },
            ].map(item => (
              <FadeIn key={item.step}>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#fff', border: '2px solid rgba(0,0,0,0.06)' }}>
                  <div className="text-4xl font-bold mb-3" style={{ ...displayFont, color: `${item.color}40` }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ ...sansFont, color: MUTED }}>
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-reference phrases for parents */}
      <FadeIn>
        <section className="py-20" style={{ backgroundColor: SURFACE }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.25em] font-bold" style={{ ...sansFont, color: AMBER }}>
                Starter phrases
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-3" style={{ ...displayFont, color: '#18181B' }}>
                Words kids actually use
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { en: 'What is your name?', es: '¿Cómo te llamas?' },
                { en: 'I am hungry.', es: 'Tengo hambre.' },
                { en: 'Can I go to the bathroom?', es: '¿Puedo ir al baño?' },
                { en: 'I do not understand.', es: 'No entiendo.' },
                { en: 'How do you say...?', es: '¿Cómo se dice...?' },
                { en: 'That is really cool!', es: '¡Qué chévere! / ¡Qué padre!' },
                { en: 'I like dogs.', es: 'Me gustan los perros.' },
                { en: 'My favorite color is blue.', es: 'Mi color favorito es el azul.' },
                { en: 'Let\'s play!', es: '¡Vamos a jugar!' },
              ].map(phrase => (
                <div
                  key={phrase.en}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#fff', border: '2px solid rgba(0,0,0,0.06)' }}
                >
                  <p className="text-sm font-bold mb-1" style={{ ...sansFont, color: '#18181B' }}>{phrase.en}</p>
                  <p className="text-sm font-semibold" style={{ ...sansFont, color: PURPLE }}>{phrase.es}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm mb-4" style={{ ...sansFont, color: MUTED }}>
                The app teaches hundreds more — in context, with an AI that talks back and corrects gently.
              </p>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
                style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
              >
                Practice all of these in the app →
              </a>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Cross-link to adult site */}
      <FadeIn>
        <section className="py-20" style={{ backgroundColor: '#FDFCF9' }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>
              Also in the Language Threshold family
            </h2>
            <p className="text-sm mb-8" style={{ ...sansFont, color: MUTED }}>
              When your child is ready for professional-level fluency — or if you are learning alongside them.
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              <a
                href={ADULT_URL}
                className="group block p-6 rounded-2xl transition-all"
                style={{ backgroundColor: '#0D0D0D', border: '2px solid rgba(201,168,76,0.2)', textDecoration: 'none' }}
              >
                <div className="text-2xl mb-2">🎓</div>
                <div className="text-base font-bold mb-1" style={{ fontFamily: '"Playfair Display", serif', color: '#F7F3EC' }}>
                  Language Threshold
                </div>
                <p className="text-xs leading-relaxed" style={{ ...sansFont, color: '#A89F94' }}>
                  Professional Spanish for nurses, construction, coaches, missionaries, and more.
                </p>
              </a>
              <a
                href="https://medicalspanish.app"
                className="group block p-6 rounded-2xl transition-all"
                style={{ backgroundColor: '#fff', border: '2px solid rgba(74,158,255,0.2)', textDecoration: 'none' }}
              >
                <div className="text-2xl mb-2">🩺</div>
                <div className="text-base font-bold mb-1" style={{ ...displayFont, color: '#18181B' }}>
                  Medical Spanish
                </div>
                <p className="text-xs leading-relaxed" style={{ ...sansFont, color: MUTED }}>
                  Spanish for nurses, surgeons, and healthcare professionals.
                </p>
              </a>
              <a
                href="https://constructionspanish.app"
                className="group block p-6 rounded-2xl transition-all"
                style={{ backgroundColor: '#fff', border: '2px solid rgba(255,122,74,0.2)', textDecoration: 'none' }}
              >
                <div className="text-2xl mb-2">🔨</div>
                <div className="text-base font-bold mb-1" style={{ ...displayFont, color: '#18181B' }}>
                  Contractor Spanish
                </div>
                <p className="text-xs leading-relaxed" style={{ ...sansFont, color: MUTED }}>
                  Spanish for framers, plumbers, electricians, and foremen.
                </p>
              </a>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Final CTA */}
      <FadeIn>
        <section className="py-28 text-center relative overflow-hidden" style={{ backgroundColor: PURPLE }}>
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-8xl">🐾</div>
            <div className="absolute top-20 right-20 text-6xl">⚽</div>
            <div className="absolute bottom-10 left-1/4 text-7xl">🔬</div>
            <div className="absolute bottom-20 right-10 text-6xl">🎨</div>
          </div>
          <div className="max-w-2xl mx-auto px-6 relative">
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6" style={{ ...displayFont, color: '#fff' }}>
              Curious kids learn<br />
              <em>the fastest.</em>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ ...sansFont, color: 'rgba(255,255,255,0.8)' }}>
              Don't wait for the perfect curriculum or the right semester. Start with one topic.
              Ten minutes a day. The language will follow.
            </p>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90 mb-4"
              style={{ ...sansFont, backgroundColor: '#fff', color: PURPLE }}
            >
              Start Learning — It's Free →
            </a>
            <p className="text-xs" style={{ ...sansFont, color: 'rgba(255,255,255,0.6)' }}>
              No signup required. No credit card. Pick a topic and go.
            </p>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
