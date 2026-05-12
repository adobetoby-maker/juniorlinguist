import FadeIn from '../components/FadeIn'
import { PURPLE, ADULT_URL, sansFont, MUTED } from '../constants'

const STAT_CARDS = [
  { value: '7–14', label: 'Target age range' },
  { value: '9', label: 'Topic modules' },
  { value: '90+', label: 'Vocabulary words' },
  { value: '100%', label: 'Free to explore' },
]

export default function About() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FDFCF9 60%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 uppercase tracking-widest" style={{ backgroundColor: 'rgba(124,58,237,0.08)', color: PURPLE, fontFamily: '"Nunito", sans-serif' }}>
              Our story
            </div>
            <h1 className="font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.2, color: '#18181B' }}>
              Built for the kids who ask<br /><em style={{ color: PURPLE }}>"How do you say that?"</em>
            </h1>
            <p className="text-lg leading-relaxed" style={{ ...sansFont, color: MUTED, maxWidth: '36rem', margin: '0 auto' }}>
              Junior Linguist grew out of a simple observation: children pick up language faster than adults — but most learning tools are built for grown-ups. We wanted something different.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 px-6 border-y" style={{ borderColor: 'rgba(124,58,237,0.1)', backgroundColor: '#F5F3FF' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STAT_CARDS.map(s => (
            <FadeIn key={s.value}>
              <div className="text-center">
                <div className="font-bold mb-1" style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: PURPLE }}>{s.value}</div>
                <div className="text-sm font-semibold" style={{ ...sansFont, color: MUTED }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="font-bold mb-8" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#18181B' }}>
              Where it started
            </h2>
          </FadeIn>

          <div className="space-y-6 text-base leading-relaxed" style={{ ...sansFont, color: '#3F3F46' }}>
            <FadeIn delay={80}>
              <p>
                Our parent site,{' '}
                <a href={ADULT_URL} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, fontWeight: 600 }}>Language Threshold</a>,
                {' '}was built for adults — nurses, contractors, first responders — who needed Spanish vocabulary for their specific jobs. Real words, real context, no filler.
              </p>
            </FadeIn>
            <FadeIn delay={140}>
              <p>
                Families using Language Threshold kept asking the same question: <strong>"Is there something like this for my kids?"</strong> Their children were curious. They wanted to learn the same words. But the adult interface — dense, professional, text-heavy — wasn't built for a nine-year-old.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p>
                So we built Junior Linguist. Same idea — vocabulary that sticks because it means something to you, right now — but filtered through the things kids actually care about: animals, food, sports, science, art. Phrases you can use at dinner tonight. Fun facts that make words memorable.
              </p>
            </FadeIn>
            <FadeIn delay={260}>
              <p>
                We paid special attention to homeschool families, who often want language woven into a bigger curriculum rather than siloed in a separate app. Every module here can pair with a science unit, a geography lesson, or a family conversation.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F5F3FF' }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-bold text-center mb-14" style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#18181B' }}>
              How we think about learning
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Context over lists',
                body: 'Every word lives in a real sentence. We skip rote flashcard drills in favor of vocabulary that shows up where kids already spend their time — the kitchen, the field, the classroom.',
              },
              {
                icon: '🔍',
                title: 'Curiosity as the engine',
                body: 'Every module has a fun fact that connects the word to history, culture, or science. "Why does this word exist?" is the best question a young learner can ask.',
              },
              {
                icon: '🏡',
                title: 'Family-first design',
                body: 'Parents and kids can explore together. Starter phrases are simple enough to practice at the dinner table. No login required, no data collected from children.',
              },
            ].map(card => (
              <FadeIn key={card.title} delay={80}>
                <div className="rounded-2xl p-7 h-full" style={{ backgroundColor: '#fff', border: '1.5px solid rgba(124,58,237,0.12)' }}>
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="font-bold mb-3 text-base" style={{ fontFamily: '"Playfair Display", serif', color: '#18181B' }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ ...sansFont, color: MUTED }}>{card.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Homeschool callout */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="rounded-2xl p-10 text-center" style={{ background: `linear-gradient(135deg, ${PURPLE}18 0%, rgba(13,148,136,0.08) 100%)`, border: `1.5px solid ${PURPLE}22` }}>
              <div className="text-4xl mb-4">🏠</div>
              <h2 className="font-bold mb-4" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', color: '#18181B' }}>
                For homeschool families
              </h2>
              <p className="mb-6 leading-relaxed" style={{ ...sansFont, color: MUTED, maxWidth: '28rem', margin: '0 auto 1.5rem' }}>
                Junior Linguist fits naturally into a homeschool day. Each topic module pairs with science, social studies, or creative writing units. Use the vocabulary, sample phrases, and fun facts as discussion starters or copywork prompts.
              </p>
              <a
                href="/#homeschool"
                className="inline-block px-6 py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
                style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
              >
                See how it works →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Adult ecosystem */}
      <section className="py-16 px-6 border-t" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm font-semibold mb-2 uppercase tracking-widest" style={{ ...sansFont, color: MUTED }}>
              Part of a larger family
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ ...sansFont, color: '#52525B' }}>
              Junior Linguist is part of the{' '}
              <a href={ADULT_URL} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, fontWeight: 600 }}>Language Threshold</a>
              {' '}ecosystem — specialized Spanish tools for real-world contexts. When your child is ready for the adult version, it'll be waiting.
            </p>
            <a
              href={ADULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ ...sansFont, border: `1.5px solid ${PURPLE}`, color: PURPLE, backgroundColor: 'transparent' }}
            >
              Explore Language Threshold →
            </a>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
