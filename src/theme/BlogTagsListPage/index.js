import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTag, setSelectedTag] = useState(null); // 當前選中的標籤
  const [searchQuery, setSearchQuery] = useState('');

  // 全部標籤陣列
  const allTags = useMemo(() => Object.values(tags).sort((a, b) => b.count - a.count), [tags]);

  // 過濾顯示的標籤小卡 (搜尋用)
  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="標籤過濾器">
      <main className="container margin-vert--lg">
        <div className="tags-interactive-header">
          <h1>熱門標籤</h1>
          
          {/* 搜尋與控制區 */}
          <div className="tags-controls">
            <input 
              type="text" 
              placeholder="搜尋標籤..." 
              className="tag-search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 上方：標籤小卡雲 (點擊不跳轉，僅選取) */}
          <div className="tag-selection-cloud">
            {filteredTags.map((tag) => (
              <button
                key={tag.permalink}
                className={`tag-pill ${selectedTag?.permalink === tag.permalink ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag?.permalink === tag.permalink ? null : tag)}
              >
                {tag.label} <span>{tag.count}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className="tags-divider" />

        {/* 下方：預留文章清單區 */}
        <div className="tag-results-section">
          {selectedTag ? (
            <div className="selected-tag-info">
              <h2>正在查看：{selectedTag.label}</h2>
              <p>大叔，目前 Docusaurus 預設 Tags 數據不含文章內容，</p>
              <p>點擊下方按鈕前往該標籤頁面查看完整文章列表：</p>
              <Link to={selectedTag.permalink} className="button button--primary">
                查看 "{selectedTag.label}" 的所有文章
              </Link>
            </div>
          ) : (
            <div className="empty-tag-state">
              <p>💡 請從上方選擇一個標籤來過濾內容</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
