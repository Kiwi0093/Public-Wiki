import os
import re

def transform_img_to_mdx(match):
    tag_content = match.group(0)
    
    # 1. 提取 src (支援雙引號或單引號)
    src_match = re.search(r'src=["\'](.*?)["\']', tag_content)
    src = src_match.group(1) if src_match else ""
    
    # 2. 提取 width (不管是 width="50%" 還是 width=50%)
    width_match = re.search(r'width=["\']?(\d+%)["\']?', tag_content)
    width_val = width_match.group(1) if width_match else None
    
    # 3. 構建 MDX/JSX 格式
    # 如果有寬度，就轉成 style={{ width: '50%' }}
    if width_val:
        new_tag = f'<img src="{src}" style={{{{ width: "{width_val}" }}}} />'
    else:
        new_tag = f'<img src="{src}" />'
        
    return new_tag

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 核心正則：抓取所有的 <img> 標籤
    # 它會處理標籤內部的換行或多餘空格
    content = re.sub(r'<img\s+[^>]+>', transform_img_to_mdx, content, flags=re.IGNORECASE | re.DOTALL)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"🖼️  圖片格式已優化: {os.path.basename(filepath)}")

# --- 執行路徑 (請根據大叔的目錄結構調整) ---
TARGET_DIRS = ["00_Publish/Blog", "00_Publish/Wiki"]

for folder in TARGET_DIRS:
    if os.path.exists(folder):
        for root, _, files in os.walk(folder):
            for file in files:
                if file.endswith(('.md', '.mdx')):
                    process_file(os.path.join(root, file))
