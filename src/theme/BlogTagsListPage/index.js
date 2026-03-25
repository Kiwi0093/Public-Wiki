import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState(new Set()); // 改用 Set 避免全亮
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnd, setIsAnd] = useState(false);

  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  const filteredTags = allTags.filter(tag => 
    tag.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (tagName) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tagName)) next.delete(tagName);
      else next.add(tagName);
      return next;
    });
  };

  const filteredPostsData = useMemo(() => {
    if (selectedTags.size === 0) return [];
    const postLists = Array.from(selectedTags)
      .map(name => tags[name]?.items)
      .filter(items => Array.isArray(items));
    
    if (postLists.length === 0) return [];
    if (isAnd) {
      return postLists.reduce((a, b) => a.filter(c => b.includes(c)));
    }
    return [...new Set(postLists.flat())];
  }, [selectedTags, tags, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1 style={{color: '#e3b341'}}>熱門標籤</h1>
        
        <div className="tags-dashboard" style={{background: '#1b1b1d', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '30px'}}>
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
            <input 
              type="text" 
              placeholder="搜尋標籤..." 
              style={{flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#000', color: '#fff'}}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={{padding: '0 20px', borderRadius: '6px', cursor: 'pointer', background: '#e3b341', color: '#000', fontWeight: 'bold', border: 'none'}} onClick={() => setSelectedTags(new Set())}>重置</button>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
            <span style={{fontSize: '0.9rem', color: isAnd ? '#666' : '#e3b341'}}>聯集 (OR)</span>
            <label className="switch">
              <input type="checkbox" checked={isAnd} onChange={() => setIsAnd(!isAnd)} />
              <span className="slider"></span>
            </label>
            <span style={{fontSize: '0.9rem', color: isAnd ? '#e3b341' : '#666'}}>交集 (AND)</span>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'}}>
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.has(tag.name);
              return (
                <div 
                  key={tag.name} 
                  onClick={() => toggleTag(tag.name)}
                  style={{
                    padding: '15px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#e3b341' : '#333'}`,
                    background: isSelected ? 'rgba(227, 179, 65, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: '0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{color: isSelected ? '#e3b341' : '#ccc', fontWeight: 'bold'}}>{tag.label}</div>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>{tag.count} 篇</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {selectedTags.size > 0 ? (
            <div style={{animation: 'fadeIn 0.5s'}}>
              <h3>符合條件的文章 ({filteredPostsData.length})</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                {filteredPostsData.map(postPermalink => (
                  <li key={postPermalink} style={{padding: '10px 0', borderBottom: '1px solid #222'}}>
                    <Link to={postPermalink} style={{color: '#e3b341', textDecoration: 'none'}}>
                      {postPermalink.split('/').pop().replace('.html', '')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '40px', border: '1px dashed #333', color: '#666', borderRadius: '12px'}}>
              請點擊標籤開始過濾
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
