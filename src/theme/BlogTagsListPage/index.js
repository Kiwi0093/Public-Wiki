import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {PageMetadata} from '@docusaurus/theme-common';

export default function BlogTagsListPage({tags}) {
  // 將標籤按字母或數量排序
  const sortedTags = Object.values(tags).sort((a, b) => b.count - a.count);

  return (
    <Layout title="標籤雲">
      <PageMetadata title="所有標籤" />
      <main className="container margin-vert--lg">
        <header className="margin-bottom--xl text--center">
          <h1>熱門標籤</h1>
          <p>透過標籤快速探索感興趣的主題</p>
        </header>

        {/* 仿 Showcase 的卡片網格佈局 */}
        <section className="tag-card-grid">
          {sortedTags.map((tag) => (
            <Link
              key={tag.permalink}
              href={tag.permalink}
              className="tag-card-item"
            >
              <div className="tag-card-content">
                <span className="tag-card-name">{tag.label}</span>
                <span className="tag-card-count">{tag.count} 篇文章</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
}
