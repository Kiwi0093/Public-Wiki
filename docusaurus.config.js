// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
  url: 'https://kiwireich.com', 
  baseUrl: '/',            
  onBrokenLinks: 'ignore',
  favicon: 'img/favicon.ico',
  
  // 💡 終極安全注入：放棄 JS 邏輯，改用 Docusaurus 原生 headTags 注入純 CSS，100% 避免語法解析衝突
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
      attributes: {
        type: 'text/css',
      },
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
