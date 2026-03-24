import os
import re

def style_to_jsx(match):
    style_str = match.group(1)
    style_str = style_str.replace('zoom:', 'width:')
    props = style_str.split(';')
    jsx_props = []
    for p in props:
        if ':' in p:
            key, val = p.split(':', 1)
            key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), key.strip())
            jsx_props.append(f"{key}: '{val.strip()}'")
    return "style={{" + ", ".join(jsx_props) + "}}"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # --- 1. 處理 Obsidian 縮圖語法 ![alt|width](url) ---
    def obsidian_replacer(match):
        alt, width, url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{url}" alt="{alt}" style={{{{width: "{width}{unit}", height: "auto"}}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', obsidian_replacer, content)

    # --- 2. 處理 style="xxx" -> style={{xxx}} ---
    content = re.sub(r'style="([^"]*)"', style_to_jsx, content)

    # --- 3. 修復 color=xxx 轉 JSX ---
    content = re.sub(r'color=([a-zA-Z0-9#]+)', r"style={{color: '\1'}}", content)

    # --- 4. 暴力修復 & 符號 (MDX 報錯核心) ---
    # 只要 & 後面不是緊跟著實體字元 (如 &amp;)，就把它轉義
    content = re.sub(r'&(?!(amp|lt|gt|quot|apos|#?\w+);)', '&amp;', content)

    # --- 5. 修復標籤交叉與配對 (解決 </del> 報錯) ---
    # 這是處理 <font><del>...</font></del> 的常見錯誤
    pairs = [('font', 'del'), ('ruby', 'del'), ('font', 'span')]
    for t1, t2 in pairs:
        # 修正閉合順序錯誤
        content = content.replace(f'</{t1}></{t2}>', f'</{t2}></{t1}>')
        # 如果有 <ruby><a>...</a><rt>...</rt></ruby> 這種連結沒關好的
        content = re.sub(r'(<a [^>]*>[^<]+)(<rt)', r'\1</a>\2', content)

    # --- 6. 補齊自閉合標籤 ---
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 執行掃描
for root, dirs, files in os.walk('.'):
    if 'blog' in root or 'docs' in root:
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))

print("✅ MDX Fixer: 符號轉義與標籤配對修正完成。")
