import snapshot from './generated/hello-little-one.booklet.json'

export interface BookletSentence {
  sentenceId: string
  order: number
  en: string
  es: string
}

export interface BookletPage {
  pageId: string
  sourceLabel: string
  order: number
  kind: 'cover' | 'story'
  image: {
    assetId: string
    url: string
    altText: { source: string; target: string }
    ownershipStatus: 'verification-required' | 'verified'
    storageStatus: 'migration-pending' | 'owned'
    sha256: string
  }
  sentences: BookletSentence[]
}

export interface BookletVocabulary {
  vocabularyId: string
  term: { source: string; target: string }
  gloss: { source: string; target: string }
}

export interface KidsBooklet {
  adapterVersion: '1.0.0'
  schemaVersion: '1.0.0'
  bookId: string
  editionId: string
  editionVersion: number
  sourceLanguage: 'en'
  targetLanguage: 'es'
  contentStatus: 'needs-native-review' | 'approved'
  consumer: 'junior-linguist'
  title: string
  titleEs: string
  audienceModes: string[]
  minimumAge: number
  maximumAge: number
  level: 'pre-reader'
  pages: BookletPage[]
  vocabulary: BookletVocabulary[]
}

export const BOOKLET_SOURCE = snapshot.generatedFrom
export const HELLO_LITTLE_ONE = snapshot.booklet as KidsBooklet
export const KIDS_BOOKLETS: KidsBooklet[] = [HELLO_LITTLE_ONE]
