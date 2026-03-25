import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false);

  // 1. 取得全站文章資料 (用於顯示卡片)
  // 注意：請確保你的 docusaurus.config.js 有開啟 blog 插件
  const blogData = usePluginData('docusaurus-plugin-content-blog');
  const allPosts = useMemo(() => blogData?.posts || [], [blogData]);

  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (permalink) => {
    setSelectedTags(prev => 
      prev.includes(permalink) ? prev.filter(t => t !== permalink) : [...prev, permalink]
    );
  };

  // 2. 核心邏輯：根據選中的 Tags 過濾文章
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return [];
    return allPosts.filter(post => {
      const postTagPermalinks = post.metadata.tags.map(t => t.permalink);
      if (isAnd) {
        return selectedTags.every(st => postTagPermalinks.includes(st));
      }
      return selectedTags.some(st => postTagPermalinks.includes(st));
    });
  }, [selectedTags, allPosts, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1>熱門標籤</h1>
        
        <div className="tags-dashboard">
          <div className="tags-search-row">
            <input 
              type="text" 
              placeholder="搜尋標籤..." 
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
                onClick={() => toggleTag(tag.permalink)}
              >
                <div className="tag-card-name">{tag.label}</div>
                <div className="tag-card-count">{tag.count} 篇</div>
              </div>
            ))}
          </div>
        </div>

        {/* 下方文章卡片區 - 這裡就是你要的 Showcase 效果 */}
        <div className="tag-results-container">
          {selectedTags.length > 0 ? (
            <>
              <h2 className="results-title">符合條件的文章 ({filteredPosts.length})</h2>
              <div className="post-card-grid">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <Link to={post.metadata.permalink} key={post.metadata.permalink} className="post-item-card">
                      <div className="post-card-content">
                        <div className="post-card-date">{post.metadata.formattedDate}</div>
                        <div className="post-card-title">{post.metadata.title}</div>
                        <p className="post-card-description">{post.metadata.description}</p>
                        <div className="post-card-tags">
                          {post.metadata.tags.map(t => <span key={t.label}>#{t.label}</span>)}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="no-results">找不到符合條件的文章</div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">💡 請點擊上方標籤開始篩選文章</div>
          )}
        </div>
      </main>
    </Layout>
  );
}
