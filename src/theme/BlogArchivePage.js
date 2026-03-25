import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function YearSection({year, posts}) {
  return (
    <div className="archive-year-wrapper">
      {/* 年份標題，內含圓圈 */}
      <h2 className="archive-year-header">
        <span className="archive-year-circle"></span>
        {year}
      </h2>
      <div className="archive-posts-container">
        {posts.map((post) => (
          <div key={post.metadata.permalink} className="archive-post-item">
            <span className="archive-post-dot"></span>
            <time className="archive-post-date">
              {new Date(post.metadata.date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
            </time>
            <Link to={post.metadata.permalink} className="archive-post-link">
              {post.metadata.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogArchivePage({archive}) {
  const years = archive.blogPosts.reduce((acc, post) => {
    const year = new Date(post.metadata.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const sortedYears = Object.keys(years).sort((a, b) => b - a);

  return (
    <Layout title="文章歸檔">
      <main className="container margin-vert--xl archive-main">
        <div className="archive-content">
          <header className="archive-top-header">
            <h1>文章歸檔</h1>
            <p>目前共有 {archive.blogPosts.length} 篇文章</p>
          </header>
          {sortedYears.map((year) => (
            <YearSection key={year} year={year} posts={years[year]} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
