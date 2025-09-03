import { bench } from 'vitest'
import { parseCandidate } from './candidate'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

// Common Tailwind CSS candidates for benchmarking
const candidates = [
  'bg-red-500',
  'text-white',
  'p-4',
  'm-2',
  'w-full',
  'h-screen',
  'flex',
  'items-center',
  'justify-center',
  'rounded-lg',
  'shadow-md',
  'hover:bg-blue-600',
  'focus:outline-none',
  'sm:text-lg',
  'md:w-1/2',
  'lg:p-8'
]

const designSystem = buildDesignSystem(new Theme())

bench('parseCandidate', () => {
  for (let candidate of candidates) {
    Array.from(parseCandidate(candidate, designSystem))
  }
})
