import React from 'react';
import Layout from '@theme/Layout';

export default function BlogArchivePage({archive}) {
  return (
    <Layout title="真正正常的歸檔">
      <main className="container margin-vert--xl">
        <header>
          <h1>大叔的歸檔測試</h1>
          <p>如果看到這行，代表 Swizzle 成功接管了頁面！</p>
        </header>
        {/* 這裡先隨便印出文章數量測試 */}
        <div>總共有 {archive.blogPosts.length} 篇文章</div>
      </main>
    </Layout>
  );
}
