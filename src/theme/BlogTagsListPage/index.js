import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  // 按數量排序標籤
  const allTags = Object.values(tags).sort((a, b) => b.count - a.count);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1 style={{fontSize: '2.5rem', marginBottom: '2rem'}}>熱門標籤</h1>
        
        {/* 全頁面的網格佈局 */}
        <div className="tag-card-grid">
          {allTags.map((tag) => (
            <Link
              key={tag.name}
              to={tag.permalink}
              className="tag-card-item"
            >
              <div className="tag-card-content">
                <div className="tag-card-name">{tag.label}</div>
                <div className="tag-card-count">{tag.count} 篇</div>
              </div>
            </Link>
          ))}
        </div>
        
        <div style={{marginTop: '3rem', textAlign: 'center', color: '#666'}}>
          💡 點擊標籤方框查看相關分類的文章
        </div>
      </main>
    </Layout>
  );
}
