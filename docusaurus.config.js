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
          showLastUpdateTime: true, 
          showLastUpdateAuthor: true,
          routeBasePath: 'docs', 
        },
        blog: {
          routeBasePath: '/', 
          path: 'blog',
          showReadingTime: true,
          blogTitle: '大叔的自言自語',
          blogDescription: 'Kiwi自言自語,一個中年男性宣洩自己壓力的地方',
          postsPerPage: 5,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 0,
          admonitions: true,
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
        {
          to: '/tags',
          label: 'Tags',
          position: 'left',
        },
        {
          to: '/archive',
          label: 'Archives',
          position: 'left',
        },
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

  // 🛠️ 終極修復：將 configureWebpack 包裝成符合 v3 規範的本地插件
  plugins: [
    function removeProgressPlugin() {
      return {
        name: 'remove-progress-plugin',
        configureWebpack(config) {
          // 取得原本的 plugins 陣列，若無則給空陣列
          const currentPlugins = config.plugins || [];
          
          return {
            plugins: currentPlugins.filter((plugin) => {
              // 加上防呆機制：確保 plugin 有 constructor 屬性，避免 null reference 報錯
              return plugin && plugin.constructor && plugin.constructor.name !== 'ProgressPlugin';
            }),
          };
        },
      };
    },
  ],
};

module.exports = config;
