---
slug: /
title: "歡迎來到 Kiwi Wiki"
description: "個人微型私有雲架構、維運自動化與遊戲筆記存檔"
---

# 歡迎來到 Kiwi Wiki

> **"Simplicity is prerequisite for reliability."**  
> 這是個人的微型私有雲架構、系統維運筆記與生活雜項存檔[cite: 1, 7]。  
> 內容透過 Obsidian 編寫並自動同步至此。

---

### 知識庫分類總覽

<div className="row">

  {/* ─── 卡片 1：Kiwireich技術手冊 ─── */}
  <div className="col col--6 margin-bottom--lg">
    <div className="card" style={{ height: '100%', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px' }}>
      <div className="card__header" style={{ paddingBottom: '0.5rem' }}>
        <h3>🗃️ <a href="./Kiwireich技術手冊/infrastructure">Kiwireich技術手冊</a></h3>
      </div>
      <div className="card__body" style={{ fontSize: '0.9rem', paddingTop: '0.2rem' }}>
        <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: '0.8rem' }}>
          涵蓋伺服器拓撲、邊界防火牆、儲存架構與自動化維運筆記。
        </p>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
          <li>
            <a href="./Kiwireich技術手冊/infrastructure"><strong>基礎設施架構白皮書</strong></a>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              全虛擬化混成雲拓撲、CoDel 流量工程與冷熱分級儲存
            </div>
          </li>
          <li>
            <strong>網路與閘道工程</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              FreeBSD PF 防火牆、多公網 IP SNAT、WireGuard Mesh
            </div>
          </li>
          <li>
            <strong>冷熱分級儲存</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              10GbE Jumbo Frame 骨幹、ZFS 自癒池與輕量 UFS 緩衝
            </div>
          </li>
          <li>
            <strong>容器與維運自動化</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              Docker 微服務編排、排程快照備份與維運腳本
            </div>
          </li>
        </ul>
      </div>
      <div className="card__footer" style={{ borderTop: '1px solid var(--ifm-color-emphasis-100)', padding: '0.8rem 1rem' }}>
        <small><a href="./Kiwireich技術手冊/infrastructure">進入技術手冊 →</a></small>
      </div>
    </div>
  </div>

  {/* ─── 卡片 2：Kiwireich遊戲筆記 ─── */}
  <div className="col col--6 margin-bottom--lg">
    <div className="card" style={{ height: '100%', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px' }}>
      <div className="card__header" style={{ paddingBottom: '0.5rem' }}>
        <h3>🗃️ <a href="./Kiwireich遊戲筆記/PC/Battletech/Game/PC/Battletech/guide">Kiwireich遊戲筆記</a></h3>
      </div>
      <div className="card__body" style={{ fontSize: '0.9rem', paddingTop: '0.2rem' }}>
        <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: '0.8rem' }}>
          個人遊戲存檔、修改碼與玩法整理。
        </p>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
          <li>
            <strong>PC 遊戲</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              PC Game 配置、修改筆記與指引
            </div>
          </li>
          <li>
            <strong>家機 / 模擬器</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              PS2 等經典主機遊戲修改碼（改造コード）與金手指整理
            </div>
          </li>
        </ul>
      </div>
      <div className="card__footer" style={{ borderTop: '1px solid var(--ifm-color-emphasis-100)', padding: '0.8rem 1rem' }}>
        <small><a href="./Kiwireich遊戲筆記/PC/Battletech/Game/PC/Battletech/guide">進入遊戲筆記 →</a></small>
      </div>
    </div>
  </div>

</div>

---

*最後由 **Kiwi0093** 更新 · Built with Docusaurus.*[cite: 1, 3]
