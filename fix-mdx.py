import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # --- 1. 自動校正拼錯的 herf (大叔的手滑救星) ---
    content = content.replace('herf=', 'href=')

    # --- 2. 暴力修復孤兒標籤 (處理原始檔中多出的 </a>) ---
    def clean_orphan_tags(text):
        # 暫時保護正確成對的 a 連結，將其結尾標籤替換成特殊字串
        text = re.sub(r'<a\s+[^>]*>.*?</a>', lambda m: m.group(0).replace('</a>', '[[SAFE_A_CLOSE]]'), text, flags=re.DOTALL)
        # 刪除剩下的、沒有成對開啟標籤的孤兒 </a>
        text = text.replace('</a>', '')
        # 還原正確的 </a>
        text = text.replace('[[SAFE_A_CLOSE]]', '</a>')
        return text
    
    content = clean_orphan_tags(content)

    # --- 3. 處理帶連結的 Obsidian 縮圖 [![alt|width](img)](url) ---
    def ob_link_img_replacer(match):
        alt, width, img_url, link_url = match.group(1), match.group(2), match.group(3), match.group(4)
        unit = "" if "%" in width else "px"
        # 這裡也順便檢查連結裡的 &
        safe_link = link_url.replace('&', '&amp;')
        return (f'<a href="{safe_link}">'
                f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
                f'</a>')
    
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img_replacer, content)

    # --- 4. 處理單純的 Obsidian 縮圖 ![alt|width](img) ---
    def ob_img_replacer(match):
        alt, width, img_url = match.group(1), match.group(2), match.group(3)
        unit = "" if "%" in width else "px"
        return f'<img src="{img_url}" alt="{alt}" style={{{{ width: "{width}{unit}", height: "auto" }}}} />'
    
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img_replacer, content)

    # --- 5. 全域修復 style="color:..." 為 JSX 格式 {{color: "..."}} ---
    # 這是解決 <rt> 或 <font> 在 ruby 嵌套中報錯的關鍵
    def style_to_jsx(match):
        tag_name = match.group(1)
        color_val = match.group(2).strip()
        return f'<{tag_name} style={{{{color: "{color_val}"}}}}> '
    
    content = re.sub(r'<([a-z1-6]+)\s+style="color:([^"]+)">', style_to_jsx, content, flags=re.I)

    # --- 6. 修復 a 標籤 href 裡的 & ---
    def fix_href_amp(m):
        return m.group(0).replace('&', '&amp;')
    
    content = re.sub(r'<a\s+[^>]*href=[^>]+>', fix_href_amp, content)

    # --- 7. 修正標籤嵌套與自閉合 ---
    # 修正錯誤的閉合順序
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content
