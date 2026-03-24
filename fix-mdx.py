import os
import re

def style_to_jsx(match):
    # 抓取 style="..." 內容並轉成 JSX 雙大括號格式
    style_str = match.group(1)
    # 把 zoom 轉成 width，因為 Docusaurus/瀏覽器對 zoom 支援度差
    style_str = style_str.replace('zoom:', 'width:')
    
    props = style_str.split(';')
    jsx_props = []
    for p in props:
        if ':' in p:
            key, val = p.split(':', 1)
            # 轉小駝峰 (font-size -> fontSize)
            key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), key.strip())
            jsx_props.append(f"{key}: '{val.strip()}'")
    
    return "style={{" + ", ".join(jsx_props) + "}}"

def clean_tag_attributes(tag_match):
    """
    專門清理標籤內部的髒東西，例如沒加引號的屬性或多餘的 &
    """
    tag_name = tag_match.group(1)
    attrs_content = tag_match.group(2)
    
    # 1. 處理標籤內部的 & (MDX 最恨這個)
    attrs_content = attrs_content.replace('&', '')
    
    # 2. 補引號 (color=red -> color="red")
    # 排除已經有引號或大括號的情況
    def attr_fixer(m):
        key, val = m.group(1), m.group(2)
        if val.startswith(('"', "'", '{')):
            return f' {key}={val}'
        return f' {key}="{val}"'
    
    attrs_content = re.sub(r'([a-z-]+)=([^"\'{ \n>]+)', attr_fixer, attrs_content, flags=re.I)
    
    # 3. 如果是圖片，補上自閉合
    self_closing = " /" if tag_name.lower() == "img" else ""
    
    return f'<{tag_name}{attrs_content}{self_closing}>'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # A. 處理 Obsidian 縮圖語法: ![alt|width](url)
    def obsidian_replacer(match):
        alt, width, url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{url}" alt="{alt}" style={{{{width: "{width}{unit}", height: "auto"}}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', obsidian_replacer, content)

    # B. 標籤內部清洗 (補引號、去 &)
    content = re.sub(r'<([a-z1-6]+)([^>]+)>', clean_tag_attributes, content, flags=re.I)

    # C. 將 style="xxx" 轉成 style={{xxx}}
    content = re.sub(r'style="([^"]*)"', style_to_jsx, content)

    # D. 修復 color=xxx (如果剛才沒被 clean_tag 抓到的部分)
    content = re.sub(r'style={{color: (?![\'"])([^}]+)}}', r"style={{color: '\1'}}", content)

    # E. 標籤嵌套配對修正 (解決 </del> 報錯)
    # 暴力對調常見的錯誤順序
    bad_pairs = [
        (r'</font></del>', r'</del></font>'),
        (r'</ruby></del>', r'</del></ruby>'),
        (r'</font></span>', r'</span></font>')
    ]
    for bad, good in bad_pairs:
        content = content.replace(bad, good)
        
    # F. 修正 Ruby 標籤內漏掉的 </a>
    content = re.sub(r'(<a [^>]*>[^<]+)(<rt)', r'\1</a>\2', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 掃描 Repo 根目錄下的 blog 和 docs
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
