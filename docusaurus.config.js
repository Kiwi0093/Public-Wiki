// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
  url: 'https://kiwi0093.github.io', 
  baseUrl: '/Public-Wiki/',         
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  
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
          // 關鍵設定：開啟最後更新時間
          showLastUpdateTime: true, 
          // (選填) 同時顯示是誰更新的 (Kiwi)
          showLastUpdateAuthor: true,
          // Wiki 知識庫的路徑改到 /docs
          routeBasePath: 'docs', 
        },
        blog: {
          // 關鍵：將 Blog 設為網站首頁
          routeBasePath: '/', 
          showReadingTime: true,
          blogTitle: '大叔的自言自語',
          blogDescription: 'Kiwi自言自語,一個中年男性宣洩自己壓力的地方',
          postsPerPage: 5,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 'ALL',
          admonitions: false,
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
