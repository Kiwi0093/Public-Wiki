import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false);

  // 1. 取得所有標籤並排序
  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  // 2. 過濾標籤卡片 (搜尋用)
  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. 切換標籤選取狀態
  const toggleTag = (permalink) => {
    setSelectedTags(prev => 
      prev.includes(permalink) 
        ? prev.filter(t => t !== permalink) 
        : [...prev, permalink]
    );
  };

  // 4. 清除全部
  const clearAll = () => setSelectedTags([]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1>熱門標籤</h1>
        <p>目前共有 {allTags.length} 個主題</p>
        
        {/* 頂部儀表板 */}
        <div className="tags-dashboard">
          <div className="tags-search-row">
            <input 
              type="text" 
              placeholder="搜尋標籤名稱..." 
              className="showcase-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="tag-clear-btn" onClick={clearAll}>Clean All</button>
          </div>

          <div className="tags-logic-row">
            <span className={!isAnd ? 'active-logic' : ''}>OR</span>
            <label className="switch">
              <input type="checkbox" checked={isAnd} onChange={() => setIsAnd(!isAnd)} />
              <span className="slider"></span>
            </label>
            <span className={isAnd ? 'active-logic' : ''}>AND</span>
          </div>

          {/* 標籤大卡片網格 (多列自動排列) */}
          <div className="tag-card-grid">
            {filteredTags.map((tag) => (
              <div 
                key={tag.permalink}
                className={`tag-big-card ${selectedTags.includes(tag.permalink) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.permalink)}
              >
                <div className="tag-card-name">{tag.label}</div>
                <div className="tag-card-count">{tag.count} 篇文章</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="tags-divider" />

        {/* 下方清單預覽區 (Frame) */}
        <div className="tag-results-frame">
          {selectedTags.length > 0 ? (
            <div className="results-content">
              <h2>已選取條件過濾：</h2>
              <div className="active-filters margin-vert--md">
                {selectedTags.map(t => (
                  <span key={t} className="badge badge--primary margin-right--sm" style={{padding: '8px 15px', borderRadius: '20px'}}>
                    {t.split('/').pop()}
                  </span>
                ))}
              </div>
              
              <div className="alert alert--info" role="alert" style={{marginTop: '2rem'}}>
                <p>大叔，Docusaurus 預設此頁面無法直接讀取文章內文（僅有標籤統計）。</p>
                <p>點擊下方按鈕前往查看該標籤的完整文章清單：</p>
                <div className="button-group" style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {selectedTags.map(t => (
                    <Link key={t} to={t} className="button button--outline button--warning">
                      前往 {t.split('/').pop()} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h3>💡 點擊上方標籤卡片開始過濾</h3>
              <p>選取標籤後，這裡將會顯示對應的內容清單。</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
