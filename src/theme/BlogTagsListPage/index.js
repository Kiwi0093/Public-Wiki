import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BlogTagsListPage({tags}) {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [isAnd, setIsAnd] = useState(false);

  const allTags = useMemo(() => 
    Object.values(tags).sort((a, b) => b.count - a.count), 
    [tags]
  );

  const toggleTag = (tagName) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tagName)) next.delete(tagName);
      else next.add(tagName);
      return next;
    });
  };

  const filteredPosts = useMemo(() => {
    if (selectedTags.size === 0) return [];
    
    // 這裡改為抓取完整的 post 物件而非只有 permalink
    const lists = Array.from(selectedTags)
      .map(name => tags[name]?.items || [])
      .filter(items => items.length > 0);
    
    if (lists.length === 0) return [];

    let result;
    if (isAnd) {
      result = lists.reduce((a, b) => a.filter(postA => b.some(postB => postB.permalink === postA.permalink)));
    } else {
      const seen = new Set();
      result = lists.flat().filter(post => {
        if (seen.has(post.permalink)) return false;
        seen.add(post.permalink);
        return true;
      });
    }
    // 依照日期排序
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedTags, tags, isAnd]);

  return (
    <Layout title="熱門標籤">
      <main className="container margin-vert--lg">
        <h1 style={{color: '#e3b341', fontWeight: '800'}}>熱門標籤</h1>
        
        <div style={{background: '#1b1b1d', padding: '30px', borderRadius: '15px', border: '1px solid #333', marginBottom: '40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px'}}>
            <label className="switch">
              <input type="checkbox" checked={isAnd} onChange={() => setIsAnd(!isAnd)} />
              <span className="slider"></span>
            </label>
            <span style={{color: '#888', fontSize: '0.9rem'}}>目前模式：<b>{isAnd ? '精確交集 (AND)' : '聯集搜尋 (OR)'}</b></span>
            <button 
              onClick={() => setSelectedTags(new Set())}
              style={{marginLeft: 'auto', background: 'transparent', border: '1px solid #555', color: '#888', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer'}}
            >Reset</button>
          </div>

          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {allTags.map((tag) => {
              const active = selectedTags.has(tag.name);
              return (
                <div 
                  key={tag.name} 
                  onClick={() => toggleTag(tag.name)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${active ? '#e3b341' : '#444'}`,
                    background: active ? 'rgba(227, 179, 65, 0.2)' : '#111',
                    color: active ? '#e3b341' : '#aaa',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  {tag.label} <small style={{opacity: 0.6, marginLeft: '5px'}}>{tag.count}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {selectedTags.size > 0 ? (
            <div>
              <h2 style={{color: '#e3b341'}}>符合的文章 ({filteredPosts.length})</h2>
              <div style={{display: 'grid', gap: '15px'}}>
                {filteredPosts.map(post => (
                  <Link key={post.permalink} to={post.permalink} style={{textDecoration: 'none'}}>
                    <div style={{background: '#1b1b1d', padding: '20px', borderRadius: '10px', border: '1px solid #222'}}>
                      <div style={{color: '#eee', fontSize: '1.2rem', fontWeight: 'bold'}}>{post.title}</div>
                      <div style={{color: '#666', fontSize: '0.8rem', marginTop: '5px'}}>{new Date(post.date).toLocaleDateString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div style={{textAlign: 'center', color: '#444', padding: '100px 0'}}>
              <h3>請從上方選擇標籤</h3>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
