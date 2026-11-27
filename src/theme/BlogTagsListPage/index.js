import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

export default function BlogTagsListPage({tags}) {
  const allTags = Object.values(tags).sort((a, b) => b.count - a.count);

  const pageTitle = translate({
    id: 'theme.blog.tagsList.title',
    message: '熱門標籤',
  });

  return (
    <Layout title={pageTitle}>
      <main className="container margin-vert--lg">
        <h1 style={{fontSize: '2.5rem', marginBottom: '2rem'}}>{pageTitle}</h1>

        <div className="tag-card-grid">
          {allTags.map((tag) => (
            <Link
              key={tag.name}
              to={tag.permalink}
              className="tag-card-item">
              <div className="tag-card-content">
                <div className="tag-card-name">{tag.label}</div>
                <div className="tag-card-count">
                  <Translate
                    id="theme.blog.tagsList.postCount"
                    values={{count: tag.count}}>
                    {'{count} 篇'}
                  </Translate>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{marginTop: '3rem', textAlign: 'center', color: 'var(--kiwi-muted)'}}>
          <Translate id="theme.blog.tagsList.hint">
            {'💡 點擊標籤方框查看相關分類的文章'}
          </Translate>
        </div>
      </main>
    </Layout>
  );
}
