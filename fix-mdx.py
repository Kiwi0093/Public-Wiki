import os
import re

def fix_style_to_jsx(match):
    # 抓取 style="..." 內容
    style_content = match.group(1).strip()
    # 處理 zoom:60% -> width: '60%' (Docusaurus/JSX 比較喜歡 width)
    style_content = style_content.replace('zoom:', 'width:')
    
    # 拆解屬性並轉成 JSX 格式
    props = [p.strip() for p in style_content.split(';') if ':' in p]
    jsx_items = []
    for p in props:
        key, val = p.split(':', 1)
        # 轉小駝峰 (例如 font-size -> fontSize)
        key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), key.strip())
        jsx_items.append(f"{key}: '{val.strip()}'")
    
    return "style={{" + ", ".join(jsx_items) + "}}"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. 修正圖片與標籤的 style="xxx" -> style={{xxx}}
    content = re.sub(r'style="([^"]*)"', fix_style_to_jsx, content)

    # 2. 修正 <font color=red> 這種沒引號又沒 JSX 的寫法 -> style={{color: 'red'}}
    content = re.sub(r'color=([a-zA-Z0-9#]+)', r"style={{color: '\1'}}", content)
    
    # 3. 修正 <font size=+2> -> 直接移除 size 或轉成 fontSize (MDX 不支援 size 屬性)
    content = re.sub(r'size=["\']?\+?([0-9]+)["\']?', r"style={{fontSize: '\1em'}}", content)

    # 4. 暴力修正：處理文章標題或內容中的單個 & (MDX 的天敵)
    # 只針對不在標籤內的 & 進行替換，避免破壞網址
    content = re.sub(r'\s&\s', ' &amp; ', content)

    # 5. 確保所有 <img> 都有自閉合斜槓
    content = re.sub(r'(<img [^>]+)(?<!/)>', r'\1 />', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已轉換: {filepath}")

# 執行路徑：GitHub Action 環境下通常是根目錄
# 根據你的路徑設定調整
TARGET_DIRS = ['00_Publish/Blog', '00_Publish/Wiki']

for target in TARGET_DIRS:
    if os.path.exists(target):
        for root, _, files in os.walk(target):
            for file in files:
                if file.endswith(('.md', '.mdx')):
                    process_file(os.path.join(root, file))
