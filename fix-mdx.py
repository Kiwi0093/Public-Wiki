import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)
    modified = False

    # --------------------------------------------------------------------------
    # 0. 保護機制：暫時抽離 Code Blocks (```...``` 與 `...`)
    # 避免腳本誤傷程式碼區塊內的原始代碼、範例與 shell 變數
    # --------------------------------------------------------------------------
    code_blocks = []
    def save_code_block(match):
        code_blocks.append(match.group(0))
        return f"%%DOCUS_CODE_BLOCK_{len(code_blocks)-1}%%"

    # 暫存多行代碼區塊
    content = re.sub(r'```[\s\S]*?```', save_code_block, content)
    # 暫存行內代碼
    content = re.sub(r'`[^`\n]+`', save_code_block, content)

    # --------------------------------------------------------------------------
    # 1. 嚴格限縮 Frontmatter 範圍處理 (僅處理開頭的 --- 區塊)
    # --------------------------------------------------------------------------
    frontmatter_match = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n', content)
    if frontmatter_match:
        fm_raw = frontmatter_match.group(1)
        fm_clean = fm_raw
        
        # 清除 image: null
        fm_clean = re.sub(r'^image:\s*null\s*$', '', fm_clean, flags=re.M)
        # 僅在 Frontmatter 內清除自定義 id
        fm_clean = re.sub(r'^id:\s+.*$', '', fm_clean, flags=re.M)
        
        if fm_clean != fm_raw:
            content = f"---\n{fm_clean.strip()}\n---\n" + content[frontmatter_match.end():]
            modified = True

    # --------------------------------------------------------------------------
    # 2. 常用打字筆誤修正
    # --------------------------------------------------------------------------
    # 空連結 []() -> [#](#)
    if '[]()' in content:
        content = content.replace('[]()', '[#](#)')
        modified = True

    # 修正常見拼錯 herf= -> href=
    if 'herf=' in content:
        content = content.replace('herf=', 'href=')
        print(f"  [Fixed herf] -> {fname}")
        modified = True

    # --------------------------------------------------------------------------
    # 3. HTML Style 屬性轉 JSX 格式
    # --------------------------------------------------------------------------
    def universal_style_to_jsx(match):
        tag = match.group(1)
        attr = match.group(2).lower()
        val = match.group(3).strip()
        
        if attr == 'zoom':
            print(f"  [Fixed Zoom] -> {fname}: <{tag}> zoom to width")
            return f'<{tag} style={{{{width: "{val}"}}}}> '
        
        print(f"  [Fixed Style] -> {fname}: <{tag}> color to JSX")
        return f'<{tag} style={{{{color: "{val}"}}}}> '

    style_pattern = r'<([a-zA-Z1-6]+)[\s\xa0]+style=["\'](color|zoom):[\s\xa0]*([^"\'\s>]+)\s*;?["\']\s*>'
    content = re.sub(style_pattern, universal_style_to_jsx, content, flags=re.I)

    # --------------------------------------------------------------------------
    # 4. Obsidian 縮圖語法轉換
    # --------------------------------------------------------------------------
    # 處理帶超連結的縮圖: [![alt|width](img_url)](target_link)
    def ob_link_img(m):
        alt, w, img, link = m.group(1), m.group(2), m.group(3), m.group(4)
        print(f"  [Fixed LinkedImg] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return f'<a href="{link.replace("&", "&amp;")}"><img src="{img}" alt="{alt}" style={{{{ width: "{width_val}", height: "auto" }}}} /></a>'
    
    content = re.sub(r'\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)', ob_link_img, content)

    # 處理純縮圖: ![alt|width](img_url)
    def ob_img(m):
        alt, w, img = m.group(1), m.group(2), m.group(3)
        print(f"  [Fixed Img] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return f'<img src="{img}" alt="{alt}" style={{{{ width: "{width_val}", height: "auto" }}}} />'
    
    content = re.sub(r'!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)', ob_img, content)

    # 處理 Obsidian 內部雙向圖檔引用: ![[image.png|300]]
    def ob_wiki_img(m):
        img, w = m.group(1), m.group(2)
        print(f"  [Fixed WikiImg] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return f'<img src="./{img}" alt="{img}" style={{{{ width: "{width_val}", height: "auto" }}}} />'
    
    content = re.sub(r'!\[\[([^|\]]+)\|(\d+%?)\]\]', ob_wiki_img, content)

    # --------------------------------------------------------------------------
    # 5. HTML 標籤結構修復 (嵌套順序與自閉合)
    # --------------------------------------------------------------------------
    content = content.replace('</ruby></del>', '</del></ruby>')
    content = content.replace('</span></del>', '</del></span>')

    # 確保所有 <img> 標籤都是自閉合 (JSX 嚴格要求)
    content = re.sub(r'(<img [^>]+?)(?<!/)>', r'\1 />', content)

    # --------------------------------------------------------------------------
    # 6. 還原 Code Blocks
    # --------------------------------------------------------------------------
    for idx, block in enumerate(code_blocks):
        content = content.replace(f"%%DOCUS_CODE_BLOCK_{idx}%%", block)

    # 寫入異動
    if content != original or modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 執行批次修復
if __name__ == "__main__":
    print("🚀 Starting MDX Fixer (Robust Production Version)...")
    count = 0
    for folder in ['blog', 'docs']:
        if os.path.exists(folder):
            for root, dirs, files in os.walk(folder):
                for file in files:
                    if file.endswith(('.md', '.mdx')):
                        if process_file(os.path.join(root, file)):
                            count += 1

    print(f"✅ Finished! Total files processed and cleaned: {count}")
