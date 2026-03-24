import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)

    # 1. 修正 herf
    if 'herf=' in content:
        content = content.replace('herf=', 'href=')
        print(f"  [Fixed herf] -> {fname}")

    # 2. 強力修復 Style (全域匹配，支援各種空格 \s 與 \xa0)
    # 這裡針對 <tag style="color:xxx"> 進行轉換
    def style_to_jsx(match):
        tag = match.group(1)
        color = match.group(2).strip()
        print(f"  [Fixed Style] -> {fname}: <{tag}> color changed to JSX")
        return f'<{tag} style={{{{color: "{color}"}}}}> '

    # 正則改進：支援單引號、雙引號、以及網頁常見的特殊空格 \xa0
    style_pattern = r'<([a-z1-6]+)[\s\xa0]+style=["\']color:[\s\xa0]*([^"\'\s>]+)[\s\xa0]*["\']\s*>'
    content = re.sub(style_pattern, style_to_jsx, content, flags=re.I)

    # 3. 處理 Obsidian 縮圖 (包含帶連結與不帶連結)
    # 處理 [![]( )]( )
    def ob_link_img(m):
        alt, w, img, link = m.group(1), m.group(2), m.group(3), m.group(4)
        print(f"  [Fixed LinkedImg] -> {fname}")
        return f'<a href="{link.replace("&", "&amp;")}"><img src="{img}" alt="{alt}" style={{{{ width: "{w}{"" if "%" in w else "px"}", height: "auto" }}}} /></a>'
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img, content)

    # 處理 ![]( )
    def ob_img(m):
        alt, w, img = m.group(1), m.group(2), m.group(3)
        print(f"  [Fixed Img] -> {fname}")
        return f'<img src="{img}" alt="{alt}" style={{{{ width: "{w}{"" if "%" in w else "px"}", height: "auto" }}}} />'
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img, content)

    # 4. 修正標籤順序與自閉合
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 執行
print("🚀 Starting MDX Fixer...")
count = 0
for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['blog', 'docs']):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                if process_file(os.path.join(root, file)):
                    count += 1
print(f"✅ Finished! Total files modified: {count}")
