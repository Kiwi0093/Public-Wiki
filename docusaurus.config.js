// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Wiki',
  tagline: 'Sovereign AI & Homelab',
  url: 'https://kiwi0093.github.io', 
  baseUrl: '/Public-Wiki/',         
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  
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
          // Wiki 知識庫的路徑改到 /docs
          routeBasePath: 'docs', 
        },
        blog: {
          // 關鍵：將 Blog 設為網站首頁
          routeBasePath: '/', 
          showReadingTime: true,
          blogTitle: '最新技術筆記',
          blogDescription: 'Kiwi 的 Sovereign AI 與 Homelab 實作紀錄',
          postsPerPage: 5,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Kiwi Wiki',
      items: [
        // 第一個按鈕：連向首頁 (也就是 Blog)
        {
          to: '/', 
          label: '最新文章', 
          position: 'left',
          activeBaseRegex: '^/$', // 只有在根目錄時才亮起
        },
        // 第二個按鈕：連向 Wiki 知識庫 (自動產生的側邊欄)
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
  },
};

module.exports = config;
