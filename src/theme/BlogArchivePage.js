import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function YearSection({year, posts}) {
  return (
    <div className="archive-year-group">
      {/* 強制插入實體圓圈節點 */}
      <div className="archive-year-node"></div>
      <h2 className="archive-year-header">{year}</h2>
      <ul className="archive-list">
        {posts.map((post) => (
          <li key={post.metadata.permalink} className="archive-item">
            <time className="archive-date">
              {new Date(post.metadata.date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
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
  const years = archive.blogPosts.reduce((acc, post) => {
    const year = new Date(post.metadata.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const sortedYears = Object.keys(years).sort((a, b) => b - a);

  return (
    <Layout title="文章歸檔">
      <main className="container margin-vert--xl">
        <div className="archive-container">
          <h1>文章歸檔</h1>
          <p>目前共有 {archive.blogPosts.length} 篇文章</p>
          <div className="archive-timeline">
            {sortedYears.map((year) => (
              <YearSection key={year} year={year} posts={years[year]} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
