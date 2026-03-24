import os
import re

def style_to_jsx(match):
    # 抓取 style="..." 裡面的內容
    style_str = match.group(1)
    # 處理 zoom:60% -> width:60% (因為 Docusaurus 不愛 zoom)
    style_str = style_str.replace('zoom:', 'width:')
    
    props = style_str.split(';')
    jsx_props = []
    for p in props:
        if ':' in p:
            key, val = p.split(':', 1)
            # 轉換為小駝峰 (font-size -> fontSize)
            key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), key.strip())
            jsx_props.append(f"{key}: '{val.strip()}'")
    
    return "style={{" + ", ".join(jsx_props) + "}}"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 處理 Obsidian 縮圖語法: ![alt|width](url) -> <img ... style={{width: '...px'}} />
    # 這是解決你提到 Obsidian 沒反應、網頁太大的關鍵
    def obsidian_replacer(match):
        alt = match.group(1)
        width = match.group(2)
        url = match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{url}" alt="{alt}" style={{{{width: "{width}{unit}", height: "auto"}}}} />'
    
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', obsidian_replacer, content)

    # 2. 尋找 style="xxx" 並替換為 style={{xxx}}
    content = re.sub(r'style="([^"]*)"', style_to_jsx, content)
    
    # 3. 修復沒加引號的 <font color=blue> 或其他屬性
    # 先把 color=xxx 轉成 JSX style
    content = re.sub(r'color=([a-zA-Z0-9#]+)', r"style={{color: '\1'}}", content)
    
    # 4. 強制補齊 <img> 標籤的自閉合 (MDX 沒這個會死)
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 掃描 GitHub Repo 根目錄下的 blog 和 docs 目錄
for root, dirs, files in os.walk('.'):
    # 確保只處理 Docusaurus 的內容路徑
    if 'blog' in root or 'docs' in root:
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                process_file(os.path.join(root, file))

print("✅ GitHub Action: MDX 語法修正完成。")
