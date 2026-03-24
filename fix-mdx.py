import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. 處理 Obsidian 縮圖連結 [![alt|width](img)](url) ---
    # 這是把你剛剛那串超長 HTML 簡化後的對應轉換
    def ob_link_img_replacer(match):
        alt = match.group(1)
        width = match.group(2)
        img_url = match.group(3)
        link_url = match.group(4)
        unit = "" if "%" in width else "px"
        # 轉成 Docusaurus 最愛的 JSX 格式，解決 & 符號與縮圖問題
        return (f'<a href="{link_url}">'
                f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
                f'</a>')

    # 正則：匹配 [![alt|width](img_url)](link_url)
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 2. 處理單純的 Obsidian 縮圖 ![alt|width](img) ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 3. 暴力修正內容中的 & 符號 (避免 MDX 報錯) ---
    # 排除連結裡的 &，只抓文字中的 &
    content = re.sub(r'\s&\s', ' &amp; ', content)

    # --- 4. 修正標籤不對稱 (如 </font></del> -> </del></font>) ---
    content = content.replace('</font></del>', '</del></font>')
    content = content.replace('</ruby></del>', '</del></ruby>')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 掃描 blog 和 docs
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
