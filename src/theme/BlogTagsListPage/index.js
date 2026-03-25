import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState([]); // 儲存 tag 的 key (例如 'Old-Blog')
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false);

  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 核心修正：AND/OR 邏輯
  const filteredPostsData = useMemo(() => {
    if (selectedTags.length === 0) return [];
    
    // 取得所有選中標籤的文章列表
    const postLists = selectedTags.map(tagName => tags[tagName]?.items || []);
    
    if (isAnd) {
      // 交集邏輯 (AND)
      return postLists.reduce((a, b) => a.filter(c => b.includes(c)));
    }
    // 聯集邏輯 (OR)
    return [...new Set(postLists.flat())];
  }, [selectedTags, tags, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1>熱門標籤</h1>
        
        <div className="tags-dashboard">
          <div className="tags-search-row" style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
            <input 
              type="text" 
              placeholder="搜尋標籤名稱..." 
              style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e3b341', background: '#1b1b1d', color: 'white'}}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="tag-clear-btn" style={{padding: '0 20px', borderRadius: '8px', cursor: 'pointer'}} onClick={() => setSelectedTags([])}>Clean All</button>
          </div>

          <div className="tags-logic-row" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
            <span className={!isAnd ? 'active-logic' : ''}>OR</span>
            <label className="switch">
              <input type="checkbox" checked={isAnd} onChange={() => setIsAnd(!isAnd)} />
              <span className="slider"></span>
            </label>
            <span className={isAnd ? 'active-logic' : ''}>AND</span>
          </div>

          <div className="tag-card-grid">
            {filteredTags.map((tag) => (
              <div 
                key={tag.name} 
                className={`tag-big-card ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name]
                )}
              >
                <div className="tag-card-name" style={{color: '#e3b341', fontWeight: 'bold'}}>{tag.label}</div>
                <div className="tag-card-count" style={{fontSize: '0.8rem', color: '#888'}}>{tag.count} 篇</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tag-results-container" style={{marginTop: '30px'}}>
          {selectedTags.length > 0 ? (
            <div>
              <h2>符合條件的文章 ({filteredPostsData.length})</h2>
              {filteredPostsData.length > 0 ? (
                <ul style={{listStyle: 'none', padding: 0}}>
                  {filteredPostsData.map(postPermalink => (
                    <li key={postPermalink} style={{padding: '10px 0', borderBottom: '1px dashed #333'}}>
                      <Link to={postPermalink} style={{color: '#ccc'}}>
                        {postPermalink.split('/').pop().replace('.html', '')} →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>查無相關文章</div>
              )}
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', border: '2px dashed #333', borderRadius: '12px', color: '#666'}}>
              <h3>💡 請點擊上方標籤開始過濾</h3>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
