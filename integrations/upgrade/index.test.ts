import { expect } from 'vitest'
import { css, html, js, json, test } from '../utils'

test(
  `upgrades a v3 project to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': html`
        <h1>🤠👋</h1>
        <div class="!flex sm:!block bg-gradient-to-t bg-[--my-red]"></div>
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

    await fs.expectFileToContain(
      'src/index.html',
      html`
        <h1>🤠👋</h1>
        <div class="flex! sm:block! bg-linear-to-t bg-[var(--my-red)]"></div>
      `,
    )

    await fs.expectFileToContain('src/input.css', css`@import 'tailwindcss';`)

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
  },
)

test(
  `upgrades a v3 project with prefixes to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
          prefix: 'tw__',
        }
      `,
      'src/index.html': html`
        <h1>🤠👋</h1>
        <div class="!tw__flex sm:!tw__block tw__bg-gradient-to-t flex [color:red]"></div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .btn {
          @apply !tw__rounded-md tw__px-2 tw__py-1 tw__bg-blue-500 tw__text-white;
        }
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.html',
      html`
        <h1>🤠👋</h1>
        <div class="tw:flex! tw:sm:block! tw:bg-linear-to-t flex tw:[color:red]"></div>
      `,
    )

    await fs.expectFileToContain('src/input.css', css` @import 'tailwindcss' prefix(tw); `)
    await fs.expectFileToContain(
      'src/input.css',
      css`
        .btn {
          @apply tw:rounded-md! tw:px-2 tw:py-1 tw:bg-blue-500 tw:text-white;
        }
      `,
    )
  },
)

test(
  'migrate @apply',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss';

        .a {
          @apply flex;
        }

        .b {
          @apply !flex;
        }

        .c {
          @apply !flex flex-col! items-center !important;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.css',
      css`
        .a {
          @apply flex;
        }

        .b {
          @apply flex!;
        }

        .c {
          @apply flex! flex-col! items-center!;
        }
      `,
    )
  },
)

test(
  'migrate `@tailwind` directives',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @tailwind base;

        html {
          color: #333;
        }

        @tailwind components;

        .btn {
          color: red;
        }

        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.css',
      css`
        @layer base {
          html {
            color: #333;
          }
        }
      `,
    )
    await fs.expectFileToContain(
      'src/index.css',
      css`
        @layer components {
          .btn {
            color: red;
          }
        }
      `,
    )
  },
)

test(
  'migrate `@layer utilities` and `@layer components`',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss';

        @layer components {
          .btn {
            @apply rounded-md px-2 py-1 bg-blue-500 text-white;
          }
        }

        @layer utilities {
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.css',
      css`
        @utility btn {
          @apply rounded-md px-2 py-1 bg-blue-500 text-white;
        }

        @utility no-scrollbar {
          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
    )
  },
)

test(
  'migrates a simple postcss setup',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'postcss.config.js': js`
        module.exports = {
          plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': 'postcss-nesting',
            tailwindcss: {},
            autoprefixer: {},
          },
        }
      `,
      'src/index.html': html`
        <div class="bg-[--my-red]"></div>
      `,
      'src/index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'postcss.config.js',
      js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
    )
    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  'migrates a postcss setup using package.json config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "postcss": {
            "plugins": {
              "postcss-import": {},
              "tailwindcss/nesting": "postcss-nesting",
              "tailwindcss": {},
              "autoprefixer": {}
            }
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': html`
        <div class="bg-[--my-red]"></div>
      `,
      'src/index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.postcss).toMatchInlineSnapshot(`
      {
        "plugins": {
          "@tailwindcss/postcss": {},
        },
      }
    `)

    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  'migrates a postcss setup using a json based config file',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      '.postcssrc.json': json`
        {
          "plugins": {
            "postcss-import": {},
            "tailwindcss/nesting": "postcss-nesting",
            "tailwindcss": {},
            "autoprefixer": {}
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': html`
        <div class="bg-[--my-red]"></div>
      `,
      'src/index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let jsonConfigContent = await fs.read('.postcssrc.json')
    let jsonConfig = JSON.parse(jsonConfigContent)
    expect(jsonConfig).toMatchInlineSnapshot(`
      {
        "plugins": {
          "@tailwindcss/postcss": {},
        },
      }
    `)

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  `migrates prefixes even if other files have unprefixed versions of the candidate`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
          prefix: 'tw__',
        }
      `,
      'src/index.html': html`
        <div class="flex"></div>
      `,
      'src/other.html': html`
        <div class="tw__flex"></div>
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

    await fs.expectFileToContain('src/index.html', html`
        <div class="flex"></div>
      `)
    await fs.expectFileToContain('src/other.html', html`
        <div class="tw:flex"></div>
      `)
  },
)

test(
  `prefixed variants do not cause their unprefixed counterparts to be valid`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
          prefix: 'tw__',
        }
      `,
      'src/index.html': html`
        <div class="tw__bg-gradient-to-t"></div>
      `,
      'src/other.html': html`
        <div class="bg-gradient-to-t"></div>
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.html',
      html`
        <div class="tw:bg-linear-to-t"></div>
      `,
    )

    await fs.expectFileToContain(
      'src/other.html',
      html`
        <div class="bg-gradient-to-t"></div>
      `,
    )
  },
)
