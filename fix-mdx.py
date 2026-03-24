import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)
    modified = False

    # --- 1. 搬移原本 YAML 裡的 sed 邏輯 ---
    
    # 暴力清除 Frontmatter 中的 image: null (避免 Docusaurus 報錯)
    if 'image: null' in content:
        content = re.sub(r'^image:\s*null\s*$', '', content, flags=re.M)
        modified = True
        
    # 暴力清除 id: 行 (大叔原本 sed 做的，避免自定義 ID 衝突)
    if 'id: ' in content:
        content = re.sub(r'^id:\s+.*$', '', content, flags=re.M)
        modified = True

    # 修復空連結 []() -> [](#)
    if '[]()' in content:
        content = content.replace('[]()', '[#](#)')
        modified = True

    # --- 2. 修正 herf 拼錯 (大叔的手滑救星) ---
    if 'herf=' in content:
        content = content.replace('herf=', 'href=')
        print(f"  [Fixed herf] -> {fname}")
        modified = True

    # --- 3. 強力修復 Style (轉換為 JSX 格式) ---
    # 支援標籤如 <rt style="color:orange"> 或 <span style="zoom:60%">
    def universal_style_to_jsx(match):
        tag = match.group(1)
        attr = match.group(2).lower() # color 或 zoom
        val = match.group(3).strip()
        
        # 轉換 zoom:60% 為 width: "60%"
        if attr == 'zoom':
            print(f"  [Fixed Zoom] -> {fname}: <{tag}> zoom to width")
            return f'<{tag} style={{{{width: "{val}"}}}}> '
        
        # 轉換 color:orange 為 color: "orange"
        print(f"  [Fixed Style] -> {fname}: <{tag}> color to JSX")
        return f'<{tag} style={{{{color: "{val}"}}}}> '

    # 改進正則：抓取 <tag style="color:xxx"> 或 <tag style="zoom:xxx">
    style_pattern = r'<([a-z1-6]+)[\s\xa0]+style=["\'](color|zoom):[\s\xa0]*([^"\'\s>]+)\s*;?["\']\s*>'
    content = re.sub(style_pattern, universal_style_to_jsx, content, flags=re.I)

    # --- 4. 處理 Obsidian 縮圖 (包含帶連結與不帶連結) ---
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

    # --- 5. 修正標籤順序、自閉合與孤兒標籤 ---
    
    # 修復 </a> 孤兒 (原始檔常見錯誤)
    def clean_orphan_a(text):
        text = re.sub(r'<a\s+[^>]*>.*?</a>', lambda m: m.group(0).replace('</a>', '[[SAFE_A]]'), text, flags=re.DOTALL)
        text = text.replace('</a>', '')
        return text.replace('[[SAFE_A]]', '</a>')
    
    content = clean_orphan_a(content)

    # 修正標籤嵌套順序
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')
    
    # 確保 img 標籤自閉合
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original or modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 執行
print("🚀 Starting MDX Fixer (Integrated Version)...")
count = 0
# 掃描 blog 和 docs 資料夾
for folder in ['blog', 'docs']:
    if os.path.exists(folder):
        for root, dirs, files in os.walk(folder):
            for file in files:
                if file.endswith(('.md', '.mdx')):
                    if process_file(os.path.join(root, file)):
                        count += 1

print(f"✅ Finished! Total files processed and cleaned: {count}")
