// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
  url: 'https://kiwi0093.github.io', 
  baseUrl: '/Public-Wiki/',            
  onBrokenLinks: 'ignore', // 建議穩定後改為 'warn'
  
  // 注入 Favicon (奇威鳥)
  favicon: 'https://api.iconify.design/fluent-emoji-flat:kiwi-bird.svg?color=%234EAA25',

  markdown: {
    format: 'mdx',
    mermaid: true,
    // 提醒：onBrokenMarkdownLinks 已經在較新版本搬移，這裡保留你的結構
    // 但通常 Docusaurus 核心配置也有這個選項
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
          // 這裡有個潛在衝突：如果 blog 設為 '/' 且沒有首頁，它會佔據根目錄
          routeBasePath: '/', 
          path: 'blog',
          showReadingTime: true,
          blogTitle: '大叔的自言自語',
          blogDescription: 'Kiwi 自言自語，一個中年男性宣洩自己壓力的地方',
          postsPerPage: 5,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 'ALL', // 建議設為 'ALL' 或數字，0 會隱藏側邊欄
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
    // 這裡可以加入 Metadata 確保分享時有圖
    image: 'https://api.iconify.design/fluent-emoji-flat:kiwi-bird.svg?color=%234EAA25',
    navbar: {
      title: 'Kiwi Wiki',
      // 加入 Navbar Logo (奇威鳥)
      logo: {
        alt: 'Kiwi Logo',
        src: 'https://api.iconify.design/fluent-emoji-flat:kiwi-bird.svg?color=%234EAA25',
      },
      items: [
        { to: '/tags', label: 'Tags', position: 'left' },
        { to: '/archive', label: 'Archives', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Wiki 知識庫',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Kiwi Wiki. Built with Docusaurus.`,
    },
    // 如果你有用 Mermaid，建議在 themeConfig 也加一下
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
  },
};

module.exports = config;
