// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
//  url: 'https://github.io', 
//  baseUrl: '/Public-Wiki/',            
  url: 'https://kiwireich.com', 
  baseUrl: '/',            
  onBrokenLinks: 'ignore', // 建議穩定後改為 'warn'
  
  // 注入 Favicon (奇威鳥) - 已經清除所有毀損贅字
  favicon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjUxLjYxNSA3NC4yM2MtNzcuMDU4LjA2LTE1Mi40NTcgNTEuNzc0LTE4MS43IDg5LjAyMkMxLjQ3MyAyNTAuNDMtMzYuOTY0IDQyNy4xOTIgMjQ0LjIwOCAzODEuMjA5YzgyLjk4Ny0xMy41NzEgMTM1LjQ4MS05Mi45MzIgMTQ2LjU2LTE2My40M2MzOS4zNzYgMTMuODEyIDk5LjIyNS0yLjQxNiAxMDAuNTAzLTM4LjIzNmMxLjcxMy00OC4wMjgtODIuNjMtOTkuMzk1LTEzMC43NTYtNjAuNzRjLTMzLjIzOS0zMi4zMTEtNzEuMjheS00NC42M₂LTExOC45LTQ0LjU3M20xODkuMzg0IDEwMS41NGE5IDkgMCAwIDEgOSA5YTkgOSAwIDAgMS05IDlhOSA5IDAgMCAxLTktOWE5IDkgMCAwIDEgOS05bTI3LjI3OCA1Ni4xYWMtOC45MDggNC41NDUtMTguNzM2IDcuNjkyLTI5LjA1OSA5LjI0MmMyMS45NiA0NC4wNTQgMjkuNDI3IDkyLjU5IDQ1LjYxIDEzOC40MzJjMi43NjEtMzIuNDk5IDIuNTg4LTk0Ljk3LTE2LjU1MS0xNDcuN00yMzguNDk0IDQwMS40MjZhMjM5IDIzOSAwIDAgMS0xOC4xNDEgMy43OGwyMS44ODcgNDUuOWExMTI1IDExMjUgMCAwIDAtNTguOTQ2IDEuMzg3bC0xMS44NDItNDQuMjE1Yy02LjQ1LS4zMS0xMi44MjYtLjktMTkuMTA1LTEuNzY0bDEyLjU5OCA0Ny4wNDFjLTcuMTAzLjQ2LTE0LjI5Ni45NjktMjEuNjY0IDEuNTc4bDEuNDg0IDE3LjkzOGM3Ni4yNy02LjMxIDEzNy45Ni00LjIyIDE4My40MDQtLjAwOGwxLjY2LTE3LjkyMmMtMTkuNjEzLTEuODE4LTQyLjE4OC0zLjIzNi03Mi41MiUtMy43OTN6Ii8+PC9zdmc+',
  
  // 💡 核心注入：利用 JavaScript 動態為所有 CodeBlock 穿透載入 Noto Sans Mono 等寬字型
  scripts: [
    {
      content: `
        (function() {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = \`
            /* 1. 線上強制載入 Google 最精準的中英雙倍寬度等寬字型 */
            @import url('https://googleapis.com');
            
            /* 2. 直接從最底層 DOM 洗牌，蓋過 Prism 主題的雜湊類別 */
            pre, code, span, .token, [class*="codeBlock"] {
              font-family: 'Noto Sans Mono', 'Sarasa Mono TC', monospace !important;
              font-variant-ligatures: none !important;
              white-space: pre !important;
              letter-spacing: 0px !important;
              word-spacing: 0px !important;
            }
          \`;
          document.head.appendChild(style);
        })();
      \`,
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


