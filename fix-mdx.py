import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 核心：處理 Obsidian 縮圖語法 ![alt|width](url) ---
    # 範例：![badge|150](https://...) -> <img src="..." style={{width: "150px"}} />
    def obsidian_replacer(match):
        alt = match.group(1)
        width = match.group(2)
        url = match.group(3)
        unit = "" if "%" in width else "px" # 如果大叔寫 20% 就保留，寫 150 就補 px
        return f'<img src="{url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'

    # 正則：抓取 ![文字 | 數字或百分比](網址)
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', obsidian_replacer, content)

    # --- 額外：修復你上次推上去那個噴錯的 style=width: '33%' ---
    # 把 style=width: '33%' 轉成正確的 style={{width: '33%'}}
    def fix_broken_jsx(match):
        attr = match.group(1) # width
        val = match.group(2).strip("'\" ")
        return f'style={{{{ {attr}: "{val}%" }}}}'
    
    content = re.sub(r'style=(width|height):\s*[\'"]?(\d+)%?[\'"]?', fix_broken_jsx, content)

    # --- 基礎修復：確保所有 <img> 都有自閉合 / ---
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已修正 Obsidian 格式: {os.path.basename(filepath)}")

# 掃描目錄 (維持你原本的邏輯)
for root, dirs, files in os.walk('.'):
    if 'blog' in root or 'docs' in root:
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
