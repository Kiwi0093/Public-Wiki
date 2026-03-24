import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. [新增] 暴力修復孤兒標籤 (解決大叔原始檔的 </a> 問題) ---
    # 如果看到 </a> 但前面沒開 <a>，這在 MDX 是死罪，我們直接把它清掉
    # 我們先處理正確的 <a>...</a>，剩下的 </a> 就是孤兒
    def clean_orphan_tags(text):
        # 暫時保護正確的 a 連結
        text = re.sub(r'<a\s+[^>]*>.*?</a>', lambda m: m.group(0).replace('</a>', '[[SAFE_A_CLOSE]]'), text, flags=re.DOTALL)
        # 刪除剩下的孤兒 </a>
        text = text.replace('</a>', '')
        # 還原正確的 </a>
        text = text.replace('[[SAFE_A_CLOSE]]', '</a>')
        return text
    
    content = clean_orphan_tags(content)

    # --- 2. 處理帶連結的 Obsidian 縮圖 [![alt|width](img)](url) ---
    def ob_link_img_replacer(match):
        alt, width, img_url, link_url = match.group(1), match.group(2), match.group(3), match.group(4)
        unit = "" if "%" in width else "px"
        safe_link = link_url.replace('&', '&amp;')
        return (f'<a href="{safe_link}">'
                f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
                f'</a>')
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 3. 處理單純的 Obsidian 縮圖 ![alt|width](img) ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 4. [強化] 全域修復 style="color:..." 為 JSX 格式 ---
    # 不管在 rt 還是 span，只要看到 style="color:xxx" 就轉成 style={{color: "xxx"}}
    def style_to_jsx(match):
        tag_name = match.group(1)
        color_val = match.group(2).strip()
        return f'<{tag_name} style={{{{color: "{color_val}"}}}}> '
    
    content = re.sub(r'<([a-z1-6]+)\s+style="color:([^"]+)">', style_to_jsx, content, flags=re.I)

    # --- 5. 修復 a 標籤 href 裡的 & ---
    def fix_href_amp(m):
        return m.group(0).replace('&', '&amp;')
    content = re.sub(r'<a\s+[^>]*href=[^>]+>', fix_href_amp, content)

    # --- 6. 修正標籤嵌套與自閉合 ---
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content = content.replace('</font></del>', '</del></font>')
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 執行掃描
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                process_file(os.path.join(root, file))
