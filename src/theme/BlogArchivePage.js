import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const DATE_LOCALE_MAP = {
  'zh-Hant': 'zh-TW',
  en: 'en-US',
  ja: 'ja-JP',
};

function YearSection({year, posts, dateLocale}) {
  return (
    <div className="archive-year-group">
      <div className="archive-year-node"></div>
      <h2 className="archive-year-header">{year}</h2>
      <ul className="archive-list">
        {posts.map((post) => (
          <li key={post.metadata.permalink} className="archive-item">
            <time className="archive-date">
              {new Date(post.metadata.date).toLocaleDateString(dateLocale, {
                month: '2-digit',
                day: '2-digit',
              })}
            </time>
            <Link to={post.metadata.permalink} className="archive-link">
              {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogArchivePage({archive}) {
  const {i18n} = useDocusaurusContext();
  const dateLocale = DATE_LOCALE_MAP[i18n.currentLocale] || 'zh-TW';

  const years = archive.blogPosts.reduce((acc, post) => {
    const year = new Date(post.metadata.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const sortedYears = Object.keys(years).sort((a, b) => b - a);

  const pageTitle = translate({
    id: 'theme.blog.archive.title',
    message: '文章歸檔',
  });

  return (
    <Layout title={pageTitle}>
      <main className="container margin-vert--xl">
        <div className="archive-container">
          <h1>{pageTitle}</h1>
          <p className="archive-summary">
            <Translate
              id="theme.blog.archive.totalPosts"
              values={{count: archive.blogPosts.length}}>
              {'目前共有 {count} 篇文章'}
            </Translate>
          </p>
          <div className="archive-timeline">
            {sortedYears.map((year) => (
              <YearSection
                key={year}
                year={year}
                posts={years[year]}
                dateLocale={dateLocale}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
