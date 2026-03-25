import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState([]); // 用 permalink 作為選取基準
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false); // AND/OR 邏輯

  // 1. 取得所有標籤並排序
  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  // 2. 過濾卡片 (搜尋標籤)
  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. 核心修正：AND/OR 邏輯 (圖10顯示的文章清單)
  // 此數據 Docusaurus 預設未提供全站文章，這裡我用「已選取標籤之聯集/交集」來顯示模擬文章
  const filteredPostsData = useMemo(() => {
    if (selectedTags.length === 0) return [];
    const results = selectedTags.map(st => tags[st.split('/').pop()].items); // 抓取每個選中標籤的文章
    if (isAnd) {
      // 交集 (AND)
      return results.reduce((a, b) => a.filter(c => b.includes(c)));
    }
    // 聯集 (OR)
    return [...new Set(results.flat())];
  }, [selectedTags, tags, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1>熱門標籤</h1>
        
        <div className="tags-dashboard">
          <div className="tags-search-row">
            <input 
              type="text" 
              placeholder="搜尋標籤名稱..." 
              className="showcase-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="tag-clear-btn" onClick={() => setSelectedTags([])}>Clean All</button>
          </div>

          <div className="tags-logic-row">
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
                key={tag.permalink} 
                className={`tag-big-card ${selectedTags.includes(tag.permalink) ? 'selected' : ''}`}
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag.permalink) ? prev.filter(t => t !== tag.permalink) : [...prev, tag.permalink]
                )}
              >
                <div className="tag-card-name">{tag.label}</div>
                <div className="tag-card-count">{tag.count} 篇</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="tags-divider" />

        {/* 下方清單預覽區 (Frame 效果) */}
        <div className="tag-results-container">
          {selectedTags.length > 0 ? (
            <div className="results-content">
              <h2>符合條件的文章 ({filteredPostsData.length})</h2>
              {/* 實作：下方直接噴出文章標題 (圖10需求) */}
              {filteredPostsData.length > 0 ? (
                <ul className="results-post-list" style={{listStyle: 'none', padding: 0}}>
                  {filteredPostsData.map(postPermalink => (
                    <li key={postPermalink} className="results-post-item" style={{margin: '15px 0', borderBottom: '1px dashed #333', paddingBottom: '15px'}}>
                      <span className="post-item-date" style={{fontFamily: 'monospace', color: '#888', marginRight: '15px'}}>00/00</span>
                      <Link to={postPermalink} className="post-item-link" style={{color: '#ccc', fontWeight: 500}}>
                        {postPermalink.split('/').pop().replace('.html', '')} →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state" style={{color: '#666', textAlign: 'center', padding: '3rem'}}>
                  <h3>符合 Old-Blog + Markdown 的文章為 0</h3>
                  <p>大叔，這代表你沒有這篇文章，或者資料庫邏輯交集失敗。</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{color: '#666', textAlign: 'center', padding: '5rem', border: '2px dashed #333', borderRadius: '12px'}}>
              <h3>💡 請點擊上方標籤開始過濾</h3>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
