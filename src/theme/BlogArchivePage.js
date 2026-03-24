import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// 分年份渲染組件
function YearSection({year, posts}) {
  return (
    <div className="archive-year-section">
      <h2 className="archive-year-title">{year}</h2>
      <ul className="archive-list">
        {posts.map((post) => (
          <li key={post.metadata.permalink} className="archive-item">
            <time className="archive-date">
              {new Date(post.metadata.date).toLocaleDateString('zh-TW', {
                month: '2-digit',
                day: '2-digit',
              })}
            </time>
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
    const year = new Date(post.metadata.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(years).sort((a, b) => b - a);

  return (
    <Layout title="歸檔">
      <main className="container margin-vert--xl archive-page-container">
        <header className="archive-header">
          <h1>文章歸檔</h1>
          <p className="archive-subtitle">目前共有 {archive.blogPosts.length} 篇文章</p>
        </header>
        
        <div className="archive-timeline-wrapper">
          {sortedYears.map((year) => (
            <YearSection key={year} year={year} posts={years[year]} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
