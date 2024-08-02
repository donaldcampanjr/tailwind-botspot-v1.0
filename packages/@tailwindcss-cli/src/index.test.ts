import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as build from './commands/build'

beforeEach(async () => {
  let { clearCache } = await import('@tailwindcss/oxide')
  clearCache()
})

describe('cli', () => {
  test('builds', async () => {
    vi.spyOn(process.stderr, 'write').mockImplementation(vi.fn())
    let stdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(vi.fn())

    await build.handle({
      '--input': './src/index.css',
      '--output': null,
      '--watch': null,
      '--minify': false,
      '--optimize': false,
      '--cwd': `${__dirname}/fixtures/example-project`,
      _: [],
    })

    let css = stdoutWrite.mock.calls[0][0] as string

    expect(css.trim()).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }
      .content-\\[\\'other-project\\'\\] {
        --tw-content: 'other-project';
        content: var(--tw-content);
      }
      @supports (-moz-orient: inline) {
        @layer base {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }"
    `)
  })
})
