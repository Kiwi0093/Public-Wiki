import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. 處理帶連結的 Obsidian 縮圖 [![alt|width](img)](url) ---
    # 這是大叔你最常壞掉的那種 HTML 簡化版
    def ob_link_img_replacer(match):
        alt, width, img_url, link_url = match.group(1), match.group(2), match.group(3), match.group(4)
        unit = "" if "%" in width else "px"
        # 連結裡的 & 也要順便修復，避免 MDX 報錯
        safe_link = link_url.replace('&', '&amp;')
        return (f'<a href="{safe_link}">'
                f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
                f'</a>')

    # 正則匹配: [![alt|300](img_url)](link_url)
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 2. 處理單純的 Obsidian 縮圖 ![alt|width](img) ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    
    # 正則匹配: ![alt|20](img_url)
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 3. 強力修復 rt 標籤：解決 Unexpected closing slash ---
    def rt_to_jsx(match):
        color = match.group(1).strip()
        return f'<rt style={{{{color: "{color}"}}}}> '
    
    content = re.sub(r'<rt style="color:([^"]+)">', rt_to_jsx, content)

    # --- 4. 修復 a 標籤 href 裡的 & ---
    def fix_href_amp(m):
        full_tag = m.group(0)
        return full_tag.replace('&', '&amp;')
    
    content = re.sub(r'<a\s+[^>]*href=[^>]+>', fix_href_amp, content)

    # --- 5. 修正標籤嵌套與自閉合 ---
    # 修正順序：</span></del> 或 </ruby></del>
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content = content.replace('</font></del>', '</del></font>')
    
    # 確保所有 img 標籤結尾都有 />
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 執行掃描 (處理 blog 和 docs)
for root, dirs, files in os.walk('.'):
    # 排除 .git 和 node_modules 等不需要處理的目錄
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
