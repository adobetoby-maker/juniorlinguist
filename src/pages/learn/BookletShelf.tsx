import { Link } from 'react-router-dom'
import BookletHeader from '../../components/learn/BookletHeader'
import { HELLO_LITTLE_ONE } from '../../data/booklets'

export default function BookletShelf() {
  const cover = HELLO_LITTLE_ONE.pages[0]
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <BookletHeader backTo="/learn" backLabel="Back to topics" title="Picture Books" />
      <main
        id="booklet-shelf"
        className="mx-auto max-w-4xl px-5 pb-16"
        style={{ paddingTop: 'calc(88px + env(safe-area-inset-top, 0px))' }}
      >
        <h1 className="text-3xl font-black text-slate-950">Picture Books</h1>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-700">
          Read together, one illustrated English and Spanish page at a time.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <article>
            <Link
              to="/learn/books/hello-little-one"
              className="group block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              <div className="aspect-square overflow-hidden rounded-3xl border-2 border-violet-100 bg-violet-50 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-lg motion-reduce:transform-none">
                <img
                  src={cover.image.url}
                  alt={cover.image.altText.target}
                  width={2048}
                  height={2048}
                  className="h-full w-full object-contain"
                />
              </div>
              <h2 className="mt-3 text-base font-black leading-tight text-slate-950">
                {HELLO_LITTLE_ONE.title}
              </h2>
              <p lang="es" className="text-sm font-bold text-violet-800">{HELLO_LITTLE_ONE.titleEs}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">13 pages · Español</p>
            </Link>
          </article>
          <article aria-disabled="true">
            <div className="aspect-square rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 p-4 text-center text-slate-600">
              <div className="flex h-full flex-col items-center justify-center">
                <span aria-hidden="true" className="text-4xl">📚</span>
                <h2 className="mt-3 text-sm font-black">More books</h2>
                <p className="mt-1 text-xs">Coming soon</p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
