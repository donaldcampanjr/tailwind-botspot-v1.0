import { bench } from 'vitest'
import { compile } from '.'

const css = String.raw

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

bench('compile', async () => {
  let { build } = await compile(css`
    @tailwind utilities;
  `)

  build(candidates)
})
