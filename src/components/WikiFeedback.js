import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';

const ISSUE_BASE_URL = 'https://github.com/Kiwi0093/Public-Wiki/issues/new';

function buildIssueUrl({feedbackType, title, permalink, source, locale, lastUpdated}) {
  const params = new URLSearchParams({
    template: 'wiki-feedback.yml',
    labels: 'wiki-feedback',
    title: `[Wiki Feedback] ${title}`,
    feedback_type: feedbackType,
    page: permalink || '',
    source: source || '',
    locale: locale || 'zh-Hant',
    last_updated: lastUpdated || '',
  });
  return `${ISSUE_BASE_URL}?${params.toString()}`;
}

export default function WikiFeedback() {
  const {metadata} = useDoc();
  const {i18n} = useDocusaurusContext();

  const rawSource = metadata.source || '';
  const cleanSource = rawSource
    .replace(/^@site\/docs\//, 'Wiki/')
    .replace(/^@site\/i18n\/[^/]+\/docusaurus-plugin-content-docs\/current\//, 'Wiki/');

  const lastUpdated = metadata.lastUpdatedAt
    ? new Date(metadata.lastUpdatedAt).toISOString().slice(0, 10)
    : '';

  const outdatedUrl = buildIssueUrl({
    feedbackType: '內容已過時（版本更新／指令失效）',
    title: metadata.title,
    permalink: metadata.permalink,
    source: cleanSource,
    locale: i18n.currentLocale,
    lastUpdated,
  });

  const suggestUrl = buildIssueUrl({
    feedbackType: '建議補充範例或章節',
    title: metadata.title,
    permalink: metadata.permalink,
    source: cleanSource,
    locale: i18n.currentLocale,
    lastUpdated,
  });

  return (
    <section
      className="kiwi-wiki-feedback"
      aria-label={translate({
        id: 'wiki.feedback.ariaLabel',
        message: 'Wiki 內容回饋',
      })}>
      <div className="kiwi-wiki-feedback-text">
        <strong>
          <Translate id="wiki.feedback.heading">發現這篇筆記過時、有誤或需要補充？</Translate>
        </strong>
        <span>
          <Translate id="wiki.feedback.subheading">
            回饋會匯入結構化 Issue，作為後續 AI 與作者整理更新 Wiki 的依據。
          </Translate>
        </span>
      </div>
      <div className="kiwi-wiki-feedback-actions">
        <a
          href={outdatedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="kiwi-wiki-feedback-btn">
          <Translate id="wiki.feedback.reportOutdated">回報過時／錯誤</Translate>
        </a>
        <a
          href={suggestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="kiwi-wiki-feedback-btn kiwi-wiki-feedback-btn--secondary">
          <Translate id="wiki.feedback.suggestContent">補充範例／建議</Translate>
        </a>
      </div>
    </section>
  );
}
