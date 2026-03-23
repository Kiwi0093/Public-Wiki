// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Wiki',
  tagline: 'Sovereign AI & Homelab',
  url: 'https://kiwi0093.github.io', // <--- 檢查你的帳號
  baseUrl: '/Public-Wiki/',         // <--- 檢查你的 Repo 名稱 (大小寫需一致)
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
          routeBasePath: '/', // 讓 Wiki 變成網站首頁
        },
        blog: {
          showReadingTime: true,
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
        {to: '/blog', label: 'Blog', position: 'left'},
      ],
    },
  },
};

module.exports = config;
