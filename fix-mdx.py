import os
import re

def style_to_jsx(match):
    # 抓取 style="..." 裡面的內容
    style_str = match.group(1)
    # 拆解屬性，例如 color:blue; font-size:20px
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

    # 正則表達式：尋找 style="xxx" 並替換為 style={{xxx}}
    new_content = re.sub(r'style="([^"]*)"', style_to_jsx, content)
    
    # 順便修復沒加引號的 <font color=blue>
    new_content = re.sub(r'color=([a-zA-Z0-9#]+)', r"style={{color: '\1'}}", new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

# 掃描 blog 和 docs 目錄
for root, dirs, files in os.walk('.'):
    if 'blog' in root or 'docs' in root:
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                process_file(os.path.join(root, file))
