// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
//  url: 'https://kiwi0093.github.io', 
//  baseUrl: '/Public-Wiki/',            
  url: 'https://blog.kiwireich.com', 
  baseUrl: '/',            
  onBrokenLinks: 'ignore', // 建議穩定後改為 'warn'
  
  // 注入 Favicon (奇威鳥)
  favicon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjUxLjYxNSA3NC4yM2MtNzcuMDU4LjA2LTE1Mi40NTcgNTEuNzc0LTE4MS43IDg5LjAyMkMxLjQ3MyAyNTAuNDMtMzYuOTY0IDQyNy4xOTIgMjQ0LjIwOCAzODEuMjA5YzgyLjk4Ny0xMy41NzEgMTM1LjQ4MS05Mi45MzIgMTQ2LjU2LTE2My40M2MzOS4zNzYgMTMuODEyIDk5LjIyNS0yLjQxNiAxMDAuNTAzLTM4LjIzNmMxLjcxMy00OC4wMjgtODIuNjMtOTkuMzk1LTEzMC43NTYtNjAuNzRjLTMzLjIzOS0zMi4zMTEtNzEuMjY4LTQ0LjYwMi0xMDguOS00NC41NzNtMTg5LjM4NCAxMDEuNTRhOSA5IDAgMCAxIDkgOWE5IDkgMCAwIDEtOSA5YTkgOW Fallback 0IDAgMS05LTlhOSA5IDAgMCAxIDktOW0yNy4yNzggNTYuMTU0Yy04LjkwOCA0LjU0NS0xOC43MzYgNy42OTItMjkuMDU5IDkuMjQyYzIxLjk2IDQ0LjA1NCAyOS40Mj件 9Mi41OSA0NS42MSAxMzguNDMMmMyLjc2MS0zMi40OTkgMi41ODgtOTQuOTctMTYuNTUxLTE0Ny42NzRNMjM4LjQ5NCA0MDEuNDI2YTIzOSAyMzkgMCAwIDEtMTguMTQxIDMuNzhsMjEuODg3IDQ1L9ZmVybD0iY3VycmVudENvbG9yIiBkPSJNMjUxLjYxNSA3NC4yM2MtNzcuMDU4LjA2LTE1Mi40NT...zIi8+PC9zdmc+',
  
  // 💡 終極解法：透過 GitHub Actions 靜態編譯時，直接把這段 JS 注入到最終的 index.html 裡面
  scripts: [
    {
      content: `
        (function() {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = \`
            /* 1. 強制線上載入 Google 官方最精準的中英雙倍寬度等寬字型 */
            @import url('https://googleapis.com');
            
            /* 2. 徹底劫持全站所有代碼塊、Prism 高亮產生的標籤與 span */
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
    image: 'https://api.iconify.design/fluent-emoji-flat:kiwi-bird.svg?color=%234EAA25',
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

