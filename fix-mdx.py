import os
import re

def style_to_jsx(match):
    # 抓取 style="..." 並轉為 JSX 雙括號格式
    style_str = match.group(1)
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

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. 處理 Obsidian 縮圖連結 [![alt|width](img)](url)
    def ob_link_img_replacer(match):
        alt, width, img_url, link_url = match.group(1), match.group(2), match.group(3), match.group(4)
        unit = "" if "%" in width else "px"
        # 這裡將連結裡的 & 轉義為 &amp; 避免 MDX 在屬性裡報錯
        safe_link = link_url.replace('&', '&amp;')
        return f'<a href="{safe_link}"><img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} /></a>'
    
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # 2. 處理單純的 Obsidian 縮圖 ![alt|width](img)
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # 3. 處理 HTML 標籤內部的 & 符號 (MDX 報錯核心：104:57)
    # 我們要把標籤屬性（如 href）裡的 & 換成 &amp;
    def fix_tag_attributes(m):
        tag_start = m.group(1)
        attrs = m.group(2)
        # 只針對屬性內容中的 & 進行轉義
        fixed_attrs = attrs.replace('&', '&amp;')
        return f'<{tag_start}{fixed_attrs}>'
    
    content = re.sub(r'<([a-z1-6]+)([^>]+)>', fix_tag_attributes, content, flags=re.I)

    # 4. 修復 style="xxx" -> style={{xxx}}
    content = re.sub(r'style="([^"]*)"', style_to_jsx, content)

    # 5. 修復標籤嵌套配對順序 (解決 </del> 報錯)
    content = content.replace('</font></del>', '</del></font>')
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</font></span>', '</span></font>')

    # 6. 修復 Ruby 標籤內部的 <a> 沒關好問題
    content = re.sub(r'(<a [^>]*>[^<]+)(<rt)', r'\1</a>\2', content)

    # 7. 確保所有 img 有自閉合
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 掃描目錄
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
