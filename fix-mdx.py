import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. 自動校正拼錯的 herf ---
    content = content.replace('herf=', 'href=')

    # --- 2. 暴力修復孤兒標籤 ---
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
        return (f'<a href="{safe_link}"><img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} /></a>')
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 4. 處理單純的 Obsidian 縮圖 ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 5. [超級強化版] 轉換 style="color:xxx" ---
    # 改用更寬鬆的匹配，確保 <rt style="color:orange"> 這種一定會被抓到
    def universal_style_fixer(match):
        tag = match.group(1)      # 標籤名 (如 rt)
        color_val = match.group(2).strip() # 顏色值 (如 orange)
        return f'<{tag} style={{{{color: "{color_val}"}}}}> '

    # 正則解釋：抓取標籤名 + 任意空白 + style="color:內容" + 結尾
    content = re.sub(r'<([a-z1-6]+)\s+style=["\']color:\s*([^"\'\s>]+)\s*["\']\s*>', universal_style_fixer, content, flags=re.I)

    # --- 6. 修復 a 標籤 href 裡的 & ---
    content = re.sub(r'<a\s+[^>]*href=[^>]+>', lambda m: m.group(0).replace('&', '&amp;'), content)

    # --- 7. 修正標籤嵌套與自閉合 ---
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content = content.replace('</font></del>', '</del></font>')
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    # --- 8. 清理標籤名後多餘空格 (如 <ruby >) ---
    content = re.sub(r'<([a-z1-6]+)\s+>', r'<\1>', content, flags=re.I)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 執行掃描
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
