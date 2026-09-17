// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
  url: 'https://kiwireich.com', 
  baseUrl: '/',            
  onBrokenLinks: 'ignore',
  favicon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjUxLjYxNSA3NC4yM2MtNzcuMDU4LjA2LTE1Mi40NTcgNTEuNzc0LTE4MS43IDg5LjAyMkMxLjQ3MyAyNTAuNDMtMzYuOTY0IDQyNy4xOTIgMjQ0LjIwOCAzODEuMjA5YzgyLjk4Ny0xMy41NzEgMTM1LjQ4MS05Mi45MzIgMTQ2LjU2LTE2My40M2MzOS4zNzYgMTMuODEyIDk5LjIyNS0yLjQxNiAxMDAuNTAzLTM4LjIzNmMxLjcxMy00OC4wMjgtODIuNjMtOTkuMzk1LTEzMC43NTYtNjAuNzRjLTMzLjIzOS0zMi4zMTEtNzEuMjY4LTQ0LjYwMi0xMDguOS00NC41NzNtMTg5LjM4NCAxMDEuNTRhOSA5IDAgMCAxIDkgOWE5IDkgMCAwIDEtOSA5YTkgOSAwIDAgMS05LTlhOSA5IDAgMCAxIDktOW0yNy4yNzggNTYuMTU0Yy04LjkwOCA0LjU0NS0xOC43MzYgNy42OTItMjkuMDU5IDkuMjQyYzIxLjk2IDQ0LjA1NCAyOS40MjcgOTIuNTkgNDUuNjEgMTM4LjQzMmMyLjc2MS0zMi40OTkgMi41ODgtOTQuOTctMTYuNTUxLTE0Ny42NzRNMjM4LjQ5NCA0MDEuNDI2YTIzOSAyMzkgMCAwIDEtMTguMTQxIDMuNzhsMjEuODg3IDQ1Ljc5OGExMTI1IDExMjUgMCAwIDAtNTguOTQ2IDEuMzg3bC0xMS44NDItNDQuMjE1Yy02LjQ1LS4zMS0xMi44MjYtLjktMTkuMTA1LTEuNzY0bDEyLjU5OCA0Ny4wNDFjLTcuMTAzLjQ2LTE0LjI5Ni45NjktMjEuNjY0IDEuNTc4bDEuNDg0IDE3LjkzOGM3Ni4yNy02LjMxIDEzNy45Ni00LjIyIDE4My40MDQtLjAwOGwxLjY2LTE3LjkyMmMtMTkuNjEzLTEuODE4LTQyLjE4OC0zLjIzNi02Ny41MjUtMy43OTN6Ii8+PC9zdmc+',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://googleapis.com',
      },
    },
    {
      tagName: 'style',
      attributes: { type: 'text/css' },
      content: `
        pre, code, span, .token, [class*="codeBlock"] {
          font-family: 'Noto Sans Mono', 'Sarasa Mono TC', monospace !important;
          font-variant-ligatures: none !important;
          white-space: pre !important;
          letter-spacing: 0px !important;
          word-spacing: 0px !important;
        }
      `,
    },
    // 💡 終極 JavaScript 攔截器：在頁面載入與動態渲染時直接強制修改元素行內屬性
    {
      tagName: 'script',
      attributes: { type: 'text/javascript' },
      content: `
        document.addEventListener("DOMContentLoaded", function() {
          const applyFont = () => {
            document.querySelectorAll('pre, code, [class*="codeBlock"] span, .token').forEach(el => {
              el.style.setProperty('font-family', "'Noto Sans Mono', 'Sarasa Mono TC', monospace", 'important');
              el.style.setProperty('font-variant-ligatures', 'none', 'important');
            });
          };
          applyFont();
          setTimeout(applyFont, 500);
          setTimeout(applyFont, 1500);
        });
      `,
    },
  ],

  markdown: {
    format: 'mdx',
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true, 
          showLastUpdateAuthor: true,
          routeBasePath: 'docs', 
        },
        blog: {
          routeBasePath: '/', 
          path: 'blog',
          showReadingTime: true,
          blogTitle: '大叔的自言自語',
          blogDescription: 'Kiwi 自言自語，一個中年男性宣洩自己壓力的地方',
          postsPerPage: 5,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 'ALL',
          admonitions: {
            keywords: ['note', 'tip', 'info', 'warning', 'danger'],
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'https://iconify.design',
    navbar: {
      title: 'Kiwi Blog',
      items: [
        { to: '/tags', label: 'Tags', position: 'left' },
        { to: '/archive', label: 'Archives', position: 'left' },
        {
          to: '/docs', 
          position: 'left',
          label: 'Wiki 知識庫',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Kiwireich. Built with Docusaurus.`,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
    prism: {
      additionalLanguages: [
        'bash',
        'yaml',
        'python',
        'cue',
        'json',
        'powershell',
        'ini',
      ],
    },
  },
};

module.exports = config;
