import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// 分年份渲染組件
function YearSection({year, posts}) {
  return (
    <div className="archive-year-section">
      {/* 年份標題：大節點 */}
      <h2 className="archive-year-title">{year}</h2>
      <ul className="archive-list">
        {posts.map((post) => (
          <li key={post.metadata.permalink} className="archive-item">
            {/* 文章日期：在左側小圓點前面 */}
            <time className="archive-date">
              {new Date(post.metadata.date).toLocaleDateString('zh-TW', {
                month: '2-digit',
                day: '2-digit',
              })}
            </time>
            {/* 文章標題 */}
            <Link to={post.metadata.permalink} className="archive-link">
              {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogArchivePage({archive}) {
  // 將文章按年份分組 (降序)
  const years = archive.blogPosts.reduce((acc, post) => {
    const date = new Date(post.metadata.date);
    const year = date.getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(years).sort((a, b) => b - a);

  return (
    <Layout title="文章歸檔">
      {/* 加上 archive-page-main 用於 CSS 居中控制 */}
      <main className="container margin-vert--xl archive-page-main">
        <div className="archive-page-wrapper">
          {/* 我們不要 Hero 區塊，只要乾淨的 Header */}
          <header className="archive-header">
            <h1>文章歸檔</h1>
            <p className="archive-subtitle">目前共有 {archive.blogPosts.length} 篇文章</p>
          </header>
          
          {/* 真正的時間軸：畫線的主體 */}
          <div className="archive-timeline-content">
            {sortedYears.map((year) => (
              <YearSection key={year} year={year} posts={years[year]} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
