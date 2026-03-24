import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. 自動校正拼錯的 herf ---
    content = content.replace('herf=', 'href=')

    # --- 2. 暴力修復孤兒標籤 (</a> 前面沒 <a> 的直接刪除) ---
    def clean_orphan_tags(text):
        text = re.sub(r'<a\s+[^>]*>.*?</a>', lambda m: m.group(0).replace('</a>', '[[SAFE_A_CLOSE]]'), text, flags=re.DOTALL)
        text = text.replace('</a>', '')
        text = text.replace('[[SAFE_A_CLOSE]]', '</a>')
        return text
    content = clean_orphan_tags(content)

    # --- 3. 處理帶連結的 Obsidian 縮圖 ---
    def ob_link_img_replacer(match):
        alt, width, img_url, link_url = match.group(1), match.group(2), match.group(3), match.group(4)
        unit = "" if "%" in width else "px"
        safe_link = link_url.replace('&', '&amp;')
        return (f'<a href="{safe_link}">'
                f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
                f'</a>')
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 4. 處理單純的 Obsidian 縮圖 ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 5. [修正版] 強力全域修復 style="color:..." 為 JSX 格式 ---
    # \s+ 確保能抓到標籤名與 style 之間的一個或多個空格
    def style_to_jsx(match):
        tag_name = match.group(1)
        color_val = match.group(2).strip()
        # 轉換後確保標籤內部乾淨
        return f'<{tag_name} style={{{{color: "{color_val}"}}}}> '
    
    # 修改正則：抓取 <tag style="color:xxx"> 這種結構
    content = re.sub(r'<([a-z1-6]+)\s+style="color:\s*([^"]+)\s*">', style_to_jsx, content, flags=re.I)

    # --- 6. 修復 a 標籤 href 裡的 & ---
    def fix_href_amp(m):
        return m.group(0).replace('&', '&amp;')
    content = re.sub(r'<a\s+[^>]*href=[^>]+>', fix_href_amp, content)

    # --- 7. 修正標籤嵌套與自閉合 ---
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content = content.replace('</font></del>', '</del></font>')
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    # --- 8. 清理標籤名後多餘空格 ---
    content = re.sub(r'<([a-z1-6]+)\s+>', r'<\1>', content, flags=re.I)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 掃描並執行
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
