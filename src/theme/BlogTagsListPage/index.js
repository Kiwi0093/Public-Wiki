import React, {useState, useMemo} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {PageMetadata} from '@docusaurus/theme-common';

export default function BlogTagsListPage({tags}) {
  const [searchName, setSearchName] = useState('');
  const [isOrOperator, setIsOrOperator] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);

  // 處理搜尋與過濾邏輯
  const filteredTags = useMemo(() => {
    let result = Object.values(tags);
    if (searchName) {
      result = result.filter((tag) =>
        tag.label.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    return result.sort((a, b) => b.count - a.count);
  }, [tags, searchName]);

  return (
    <Layout title="標籤雲">
      <PageMetadata title="所有標籤" />
      <main className="container margin-vert--lg">
        {/* 官方 Showcase 頂部控制欄 */}
        <div className="showcase-controls">
          <div className="showcase-header">
            <h1>熱門標籤</h1>
            <p>目前共有 {Object.keys(tags).length} 個主題</p>
          </div>
          
          <div className="showcase-filters-bar">
            <div className="search-container">
              <input
                type="text"
                placeholder="搜尋標籤名稱..."
                onChange={(e) => setSearchName(e.target.value)}
                className="showcase-search-input"
              />
            </div>
            
            <div className="operator-container">
              <span className={!isOrOperator ? 'active-op' : ''}>AND</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isOrOperator}
                  onChange={() => setIsOrOperator(!isOrOperator)}
                />
                <span className="slider round"></span>
              </label>
              <span className={isOrOperator ? 'active-op' : ''}>OR</span>
            </div>
          </div>
        </div>

        <section className="tag-card-grid">
          {filteredTags.map((tag) => (
            <Link key={tag.permalink} href={tag.permalink} className="tag-card-item">
              <div className="tag-card-content">
                <span className="tag-card-name">{tag.label}</span>
                <span className="tag-card-count">{tag.count} 篇</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
}
