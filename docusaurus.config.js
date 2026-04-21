// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kiwi Reich',
  tagline: '大叔的自言自語',
  url: 'https://kiwi0093.github.io', 
  baseUrl: '/Public-Wiki/',            
  onBrokenLinks: 'ignore', // 建議穩定後改為 'warn'
  
  // 注入 Favicon (奇威鳥)
  favicon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjUxLjYxNSA3NC4yM2MtNzcuMDU4LjA2LTE1Mi40NTcgNTEuNzc0LTE4MS43IDg5LjAyMkMxLjQ3MyAyNTAuNDMtMzYuOTY0IDQyNy4xOTIgMjQ0LjIwOCAzODEuMjA5YzgyLjk4Ny0xMy41NzEgMTM1LjQ4MS05Mi45MzIgMTQ2LjU2LTE2My40M2MzOS4zNzYgMTMuODEyIDk5LjIyNS0yLjQxNiAxMDAuNTAzLTM4LjIzNmMxLjcxMy00OC4wMjgtODIuNjMtOTkuMzk1LTEzMC43NTYtNjAuNzRjLTMzLjIzOS0zMi4zMTEtNzEuMjY4LTQ0LjYwMi0xMDguOS00NC41NzNtMTg5LjM4NCAxMDEuNTRhOSA5IDAgMCAxIDkgOWE5IDkgMCAwIDEtOSA5YTkgOSAwIDAgMS05LTlhOSA5IDAgMCAxIDktOW0yNy4yNzggNTYuMTU0Yy04LjkwOCA0LjU0NS0xOC43MzYgNy42OTItMjkuMDU5IDkuMjQyYzIxLjk2IDQ0LjA1NCAyOS40MjcgOTIuNTkgNDUuNjEgMTM4LjQzMmMyLjc2MS0zMi40OTkgMi41ODgtOTQuOTctMTYuNTUxLTE0Ny42NzRNMjM4LjQ5NCA0MDEuNDI2YTIzOSAyMzkgMCAwIDEtMTguMTQxIDMuNzhsMjEuODg3IDQ1Ljc5OGExMTI1IDExMjUgMCAwIDAtNTguOTQ2IDEuMzg3bC0xMS44NDItNDQuMjE1Yy02LjQ1LS4zMS0xMi44MjYtLjktMTkuMTA1LTEuNzY0bDEyLjU5OCA0Ny4wNDFjLTcuMTAzLjQ2LTE0LjI5Ni45NjktMjEuNjY0IDEuNTc4bDEuNDg0IDE3LjkzOGM3Ni4yNy02LjMxIDEzNy45Ni00LjIyIDE4My40MDQtLjAwOGwxLjY2LTE3LjkyMmMtMTkuNjEzLTEuODE4LTQyLjE4OC0zLjIzNi02Ny41MjUtMy43OTN6Ii8+PC9zdmc+',

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
      title: 'Kiwi Blog',
      // 加入 Navbar Logo (奇威鳥)
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
      copyright: `Copyright © ${new Date().getFullYear()} Kiwireich. Built with Docusaurus.`,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
    // --- 語法高亮 Prism 設定 ---
    prism: {
      // 加入 Obsidian 常用與你要求的語言
      additionalLanguages: [
        'bash',
        'sh',
        'yaml',
        'python',
        'cue',
        'json',
        'powershell',
        'ini',
        // javascript 預設已內建，但寫在這裡不會有影響
      ],
      // 設定高亮主題
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
};

module.exports = config;
