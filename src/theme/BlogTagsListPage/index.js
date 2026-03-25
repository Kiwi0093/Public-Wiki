import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false);

  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPostsData = useMemo(() => {
    if (selectedTags.length === 0) return [];
    
    // 取得所有選中標籤的文章 Permalink 列表
    const postLists = selectedTags
      .map(name => tags[name]?.items)
      .filter(items => Array.isArray(items));
    
    if (postLists.length === 0) return [];

    if (isAnd) {
      // AND 邏輯：取交集
      return postLists.reduce((a, b) => a.filter(c => b.includes(c)));
    }
    // OR 邏輯：取聯集並去重
    return [...new Set(postLists.flat())];
  }, [selectedTags, tags, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1>熱門標籤</h1>
        
        <div className="tags-dashboard" style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px'}}>
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
            <input 
              type="text" 
              placeholder="搜尋標籤..." 
              style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e3b341', background: '#1b1b1d', color: 'white'}}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={{padding: '0 20px', borderRadius: '8px', cursor: 'pointer'}} onClick={() => setSelectedTags([])}>Clean All</button>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
            <span style={{color: !isAnd ? '#e3b341' : '#888'}}>OR</span>
            <label className="switch">
              <input type="checkbox" checked={isAnd} onChange={() => setIsAnd(!isAnd)} />
              <span className="slider"></span>
            </label>
            <span style={{color: isAnd ? '#e3b341' : '#888'}}>AND</span>
          </div>

          {/* Tag 卡片區塊 */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'}}>
            {filteredTags.map((tag) => (
              <div 
                key={tag.name} 
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name]
                )}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedTags.includes(tag.name) ? '#e3b341' : '#333'}`,
                  background: selectedTags.includes(tag.name) ? 'rgba(227, 179, 65, 0.1)' : '#1b1b1d',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: '0.2s'
                }}
              >
                <div style={{color: '#e3b341', fontWeight: 'bold'}}>{tag.label}</div>
                <div style={{fontSize: '0.8rem', color: '#888'}}>{tag.count} 篇</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop: '30px'}}>
          {selectedTags.length > 0 ? (
            <div>
              <h2>符合條件的文章 ({filteredPostsData.length})</h2>
              <ul style={{listStyle: 'none', padding: 0}}>
                {filteredPostsData.map(postPermalink => (
                  <li key={postPermalink} style={{padding: '10px 0', borderBottom: '1px solid #333'}}>
                    <Link to={postPermalink} style={{color: '#ccc'}}>
                      {postPermalink.split('/').pop().replace('.html', '')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', border: '2px dashed #333', borderRadius: '12px', color: '#666'}}>
              請點擊上方標籤開始過濾
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
