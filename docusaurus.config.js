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
  
  // 💡 安全修正：改為讀取您專案靜態資料夾中的標準 SVG，徹底拔除破損的 Base64 程式碼
  favicon: 'img/favicon.ico',
  
  // 💡 核心注入：利用 JavaScript 動態為所有 CodeBlock 穿透載入 Noto Sans Mono 等寬字型
  scripts: [
    {
      content: `
        (function() {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = \`
            /* 1. 線上強制載入 Google 官方最精準的中英雙倍寬度等寬字型 */
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


