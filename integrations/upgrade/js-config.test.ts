import { describe, expect } from 'vitest'
import { css, html, json, test, ts } from '../utils'

test(
  `upgrade JS config files with flat theme values, darkMode, and content fields`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'
        import defaultTheme from 'tailwindcss/defaultTheme'

        module.exports = {
          darkMode: 'selector',
          content: ['./src/**/*.{html,js}', './node_modules/my-external-lib/**/*.{html}'],
          theme: {
            boxShadow: {
              sm: '0 2px 6px rgb(15 23 42 / 0.08)',
            },
            colors: {
              red: {
                400: '#f87171',
                500: 'red',
              },
            },
            fontSize: {
              xs: ['0.75rem', { lineHeight: '1rem' }],
              sm: ['0.875rem', { lineHeight: '1.5rem' }],
              base: ['1rem', { lineHeight: '2rem' }],
            },
            width: {
              px: '1px',
              auto: 'auto',
              1: '0.25rem',
              1.5: '0.375rem',
              2: '0.5rem',
              2.5: '0.625rem',
              3: '0.75rem',
              3.5: '0.875rem',
              4: '1rem',
              5: '1.25rem',
              6: '1.5rem',
              8: '2rem',
              10: '2.5rem',
              11: '2.75rem',
              12: '3rem',
              16: '4rem',
              24: '6rem',
              32: '8rem',
              40: '10rem',
              48: '12rem',
              64: '16rem',
              80: '20rem',
              96: '24rem',
              128: '32rem',

              full: '100%',
              0: '0%',
              '1/2': '50%',
              '1/3': 'calc(100% / 3)',
              '2/3': 'calc(100% / 3 * 2)',
              '1/4': '25%',
              '3/4': '75%',
              '1/5': '20%',
              '2/5': '40%',
              '3/5': '60%',
              '4/5': '80%',
              '1/6': 'calc(100% / 6)',
              '5/6': 'calc(100% / 6 * 5)',
              '1/7': 'calc(100% / 7)',
              '1/10': 'calc(100% / 10)',
              '3/10': 'calc(100% / 10 * 3)',
              '7/10': 'calc(100% / 10 * 7)',
              '9/10': 'calc(100% / 10 * 9)',
              screen: '100vw',

              'full-minus-80': 'calc(100% - 20rem)',
              'full-minus-96': 'calc(100% - 24rem)',

              '225px': '225px',
            },
            extend: {
              colors: {
                red: {
                  500: '#ef4444',
                  600: '#dc2626',
                },
              },
              fontFamily: {
                sans: 'Inter, system-ui, sans-serif',
                display: ['Cabinet Grotesk', ...defaultTheme.fontFamily.sans],
              },
              borderRadius: {
                '4xl': '2rem',
              },
              keyframes: {
                'spin-clockwise': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                'spin-counterclockwise': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(-360deg)' },
                },
              },
              animation: {
                'spin-clockwise': 'spin-clockwise 1s linear infinite',
                'spin-counterclockwise': 'spin-counterclockwise 1s linear infinite',
              },
            },
          },
          plugins: [],
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      // prettier-ignore
      'src/test.js': ts`
        export default {
          'shouldNotMigrate': !border.test + '',
        }
      `,
      'node_modules/my-external-lib/src/template.html': html`
        <div class="text-red-500">
          Hello world!
        </div>
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,js}')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @source '../node_modules/my-external-lib/**/*.{html}';

      @variant dark (&:where(.dark, .dark *));

      @theme {
        --shadow-*: initial;
        --shadow-sm: 0 2px 6px rgb(15 23 42 / 0.08);

        --color-*: initial;
        --color-red-400: #f87171;
        --color-red-500: #ef4444;
        --color-red-600: #dc2626;

        --font-size-*: initial;
        --font-size-xs: 0.75rem;
        --font-size-xs--line-height: 1rem;
        --font-size-sm: 0.875rem;
        --font-size-sm--line-height: 1.5rem;
        --font-size-base: 1rem;
        --font-size-base--line-height: 2rem;

        --width-*: initial;
        --width-0: 0%;
        --width-1: 0.25rem;
        --width-2: 0.5rem;
        --width-3: 0.75rem;
        --width-4: 1rem;
        --width-5: 1.25rem;
        --width-6: 1.5rem;
        --width-8: 2rem;
        --width-10: 2.5rem;
        --width-11: 2.75rem;
        --width-12: 3rem;
        --width-16: 4rem;
        --width-24: 6rem;
        --width-32: 8rem;
        --width-40: 10rem;
        --width-48: 12rem;
        --width-64: 16rem;
        --width-80: 20rem;
        --width-96: 24rem;
        --width-128: 32rem;
        --width-px: 1px;
        --width-auto: auto;
        --width-1_5: 0.375rem;
        --width-2_5: 0.625rem;
        --width-3_5: 0.875rem;
        --width-full: 100%;
        --width-1\\/2: 50%;
        --width-1\\/3: calc(100% / 3);
        --width-2\\/3: calc(100% / 3 * 2);
        --width-1\\/4: 25%;
        --width-3\\/4: 75%;
        --width-1\\/5: 20%;
        --width-2\\/5: 40%;
        --width-3\\/5: 60%;
        --width-4\\/5: 80%;
        --width-1\\/6: calc(100% / 6);
        --width-5\\/6: calc(100% / 6 * 5);
        --width-1\\/7: calc(100% / 7);
        --width-1\\/10: calc(100% / 10);
        --width-3\\/10: calc(100% / 10 * 3);
        --width-7\\/10: calc(100% / 10 * 7);
        --width-9\\/10: calc(100% / 10 * 9);
        --width-screen: 100vw;
        --width-full-minus-80: calc(100% - 20rem);
        --width-full-minus-96: calc(100% - 24rem);
        --width-225px: 225px;

        --font-sans: Inter, system-ui, sans-serif;
        --font-display: Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

        --radius-4xl: 2rem;

        --animate-spin-clockwise: spin-clockwise 1s linear infinite;
        --animate-spin-counterclockwise: spin-counterclockwise 1s linear infinite;

        @keyframes spin-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-counterclockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
      }

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }

      --- src/test.js ---
      export default {
        'shouldNotMigrate': !border.test + '',
      }
      "
    `)

    expect((await fs.dumpFiles('tailwind.config.ts')).trim()).toBe('')
  },
)

test(
  'upgrades JS config files with plugins',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/typography": "^0.5.15",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'
        import typography from '@tailwindcss/typography'
        import customPlugin from './custom-plugin'

        export default {
          plugins: [
            typography,
            customPlugin({
              'is-null': null,
              'is-true': true,
              'is-false': false,
              'is-int': 1234567,
              'is-float': 1.35,
              'is-sci': 1.35e-5,
              'is-str-null': 'null',
              'is-str-true': 'true',
              'is-str-false': 'false',
              'is-str-int': '1234567',
              'is-str-float': '1.35',
              'is-str-sci': '1.35e-5',
              'is-arr': ['foo', 'bar'],
              'is-arr-mixed': [null, true, false, 1234567, 1.35, 'foo', 'bar', 'true'],
            }),
          ],
        } satisfies Config
      `,
      'custom-plugin.js': ts`
        import plugin from 'tailwindcss/plugin'
        export default plugin.withOptions((_options) => ({ addVariant }) => {
          addVariant('inverted', '@media (inverted-colors: inverted)')
          addVariant('hocus', ['&:focus', '&:hover'])
        })
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @plugin '@tailwindcss/typography';
      @plugin '../custom-plugin' {
        is-null: null;
        is-true: true;
        is-false: false;
        is-int: 1234567;
        is-float: 1.35;
        is-sci: 0.0000135;
        is-str-null: 'null';
        is-str-true: 'true';
        is-str-false: 'false';
        is-str-int: '1234567';
        is-str-float: '1.35';
        is-str-sci: '1.35e-5';
        is-arr: 'foo', 'bar';
        is-arr-mixed: null, true, false, 1234567, 1.35, 'foo', 'bar', 'true';
      }

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "

      "
    `)
  },
)

test(
  'upgrades JS config files with functions in the theme config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            extend: {
              colors: ({ colors }) => ({
                gray: colors.neutral,
              }),
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,ts}')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-gray-50: oklch(0.985 0 0);
        --color-gray-100: oklch(0.97 0 0);
        --color-gray-200: oklch(0.922 0 0);
        --color-gray-300: oklch(0.87 0 0);
        --color-gray-400: oklch(0.708 0 0);
        --color-gray-500: oklch(0.556 0 0);
        --color-gray-600: oklch(0.439 0 0);
        --color-gray-700: oklch(0.371 0 0);
        --color-gray-800: oklch(0.269 0 0);
        --color-gray-900: oklch(0.205 0 0);
        --color-gray-950: oklch(0.145 0 0);
      }

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "

      "
    `)
  },
)

test(
  'does not upgrade JS config files with theme keys contributed to by plugins in the theme config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            typography: {
              DEFAULT: {
                css: {
                  '--tw-prose-body': 'red',
                  color: 'var(--tw-prose-body)',
                },
              },
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config '../tailwind.config.ts';
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        theme: {
          typography: {
            DEFAULT: {
              css: {
                '--tw-prose-body': 'red',
                color: 'var(--tw-prose-body)',
              },
            },
          },
        },
      } satisfies Config
      "
    `)
  },
)

test(
  `does not upgrade JS config files with inline plugins`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          plugins: [function complexConfig() {}],
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        plugins: [function complexConfig() {}],
      } satisfies Config
      "
    `)
  },
)

test(
  `does not upgrade JS config files with non-simple screens object`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            screens: {
              xl: { min: '1024px', max: '1279px' },
              tall: { raw: '(min-height: 800px)' },
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        theme: {
          screens: {
            xl: { min: '1024px', max: '1279px' },
            tall: { raw: '(min-height: 800px)' },
          },
        },
      } satisfies Config
      "
    `)
  },
)

test(
  'multi-root project',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,

      // Project A
      'project-a/tailwind.config.ts': ts`
        export default {
          content: {
            relative: true,
            files: ['./src/**/*.html'],
          },
          theme: {
            extend: {
              colors: {
                primary: 'red',
              },
            },
          },
        }
      `,
      'project-a/src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.ts";
      `,
      'project-a/src/index.html': html`<div class="!text-primary"></div>`,

      // Project B
      'project-b/tailwind.config.ts': ts`
        export default {
          content: {
            relative: true,
            files: ['./src/**/*.html'],
          },
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'project-b/src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.ts";
      `,
      'project-b/src/index.html': html`<div class="!text-primary"></div>`,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('project-{a,b}/**/*.{css,ts}')).toMatchInlineSnapshot(`
      "
      --- project-a/src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-primary: red;
      }

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }

      --- project-b/src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-primary: blue;
      }

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      "
    `)
  },
)

describe('border compatibility', () => {
  test(
    'migrate border compatibility',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          // Empty / default config
          export default {
            theme: {
              extend: {},
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: var(--color-gray-200, currentColor);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility if a custom border color is used',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {
              extend: {
                borderColor: ({ colors }) => ({
                  DEFAULT: colors.blue[500],
                }),
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: oklch(0.623 0.214 259.815);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility if a custom border color is used, that matches the default v4 border color',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {
              extend: {
                borderColor: ({ colors }) => ({
                  DEFAULT: 'currentColor',
                }),
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility in the file that uses the `@import "tailwindcss"` import',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {},
          } satisfies Config
        `,
        'src/input.css': css`@import './tailwind.css';`,
        'src/tailwind.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import './tailwind.css';

        --- src/tailwind.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: var(--color-gray-200, currentColor);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility in the file that uses the `@import "tailwindcss/preflight"` import',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {},
          } satisfies Config
        `,
        'src/input.css': css`
          @import './base.css';
          @import './my-base.css';
          @import './utilities.css';
        `,
        'src/base.css': css`@tailwind base;`,
        'src/utilities.css': css`
          @tailwind components;
          @tailwind utilities;
        `,
        'src/my-base.css': css`
          @layer base {
            html {
              color: black;
            }
          }
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/base.css ---
        @import 'tailwindcss/theme' layer(theme);
        @import 'tailwindcss/preflight' layer(base);

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: var(--color-gray-200, currentColor);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }

        --- src/input.css ---
        @import './base.css';
        @import './my-base.css';
        @import './utilities.css';

        --- src/my-base.css ---
        @layer base {
          html {
            color: black;
          }
        }

        --- src/utilities.css ---
        @import 'tailwindcss/utilities' layer(utilities);
        "
      `)
    },
  )
})
