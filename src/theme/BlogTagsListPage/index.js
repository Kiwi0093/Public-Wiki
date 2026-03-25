import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  // 依照數量排序
  const allTags = Object.values(tags).sort((a, b) => b.count - a.count);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1 style={{color: '#e3b341', fontWeight: '800', marginBottom: '40px'}}>熱門標籤</h1>
        
        <div style={{
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '15px',
          background: 'rgba(255,255,255,0.03)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid #333'
        }}>
          {allTags.map((tag) => (
            <Link
              key={tag.name}
              to={tag.permalink}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid #444',
                background: '#111',
                color: '#eee',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e3b341';
                e.currentTarget.style.color = '#e3b341';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(227, 179, 65, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.color = '#eee';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{fontWeight: '600'}}>{tag.label}</span>
              <span style={{
                fontSize: '0.8rem', 
                background: '#333', 
                padding: '2px 8px', 
                borderRadius: '6px',
                color: '#aaa'
              }}>{tag.count}</span>
            </div>
            </Link>
          ))}
        </div>

        <div style={{marginTop: '40px', textAlign: 'center', color: '#666'}}>
          <p>點擊標籤查看該類別的所有文章</p>
        </div>
      </main>
    </Layout>
  );
}
