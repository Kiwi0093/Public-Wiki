import argparse
import os
import re
import shutil
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CALLOUT_TYPE_MAP = {
    "note": "note",
    "example": "note",
    "quote": "note",
    "cite": "note",
    "abstract": "info",
    "summary": "info",
    "tldr": "info",
    "info": "info",
    "todo": "info",
    "tip": "tip",
    "hint": "tip",
    "important": "tip",
    "success": "tip",
    "check": "tip",
    "done": "tip",
    "warning": "warning",
    "caution": "warning",
    "attention": "warning",
    "question": "warning",
    "help": "warning",
    "faq": "warning",
    "danger": "danger",
    "error": "danger",
    "failure": "danger",
    "fail": "danger",
    "missing": "danger",
    "bug": "danger",
}

NATIVE_ADMONITIONS = {"note", "tip", "info", "warning", "danger"}

CROSS_TAG_PAIRS = [
    ("font", "del"),
    ("ruby", "del"),
    ("ruby", "font"),
    ("span", "del"),
]

FENCE_OPEN_RE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
INLINE_CODE_RE = re.compile(r"(?<!`)(`+)(?!`)(.+?)(?<!`)\1(?!`)")
FRONTMATTER_RE = re.compile(r"^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)")
EMPTY_FRONTMATTER_RE = re.compile(r"^---\r?\n---(\r?\n|$)")
TAG_WITH_ATTRS_RE = re.compile(r"<([a-zA-Z][a-zA-Z0-9-]*)(\s+[^>]*?)(/?)>")
ATTR_TOKEN_RE = re.compile(
    r"""([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"[^"]*"|'[^']*'|\{\{[^}]*\}\}|\{[^}]*\}|([^\s"'<>`]+))"""
)
STYLE_ATTR_RE = re.compile(
    r'(<[a-zA-Z][a-zA-Z0-9-]*\b[^>]*?)\s+style=(["\'])(color|zoom):[\s\xa0]*([^"\';>]+)\s*;?\2([^>]*>)',
    re.IGNORECASE,
)
CALLOUT_HEADER_RE = re.compile(
    r"^([ \t]*)>[ \t]*\[!([a-zA-Z0-9_-]+)\]([+-])?(?:[ \t]+(.*?))?[ \t]*(\r?\n|$)"
)


def _split_trailing_eol(text):
    if text.endswith("\r\n"):
        return text[:-2], "\r\n"
    if text.endswith("\n"):
        return text[:-1], "\n"
    return text, ""


def extract_fenced_blocks(content, protected_blocks):
    """Extract CommonMark fenced code blocks (```...```, ````...````, ~~~...~~~)."""
    lines = content.splitlines(keepends=True)
    out = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        m = FENCE_OPEN_RE.match(line.rstrip("\r\n"))
        if m:
            fence = m.group(1)
            info = m.group(2)
            fence_char = fence[0]
            fence_len = len(fence)

            # CommonMark: backtick fence info strings cannot contain backticks
            if fence_char == "`" and "`" in info:
                out.append(line)
                i += 1
                continue

            buf = [line]
            i += 1
            close_re = re.compile(
                rf"^ {{0,3}}{re.escape(fence_char)}{{{fence_len},}}[ \t]*$"
            )
            while i < n:
                cur = lines[i]
                buf.append(cur)
                i += 1
                if close_re.match(cur.rstrip("\r\n")):
                    break

            raw_block = "".join(buf)
            block_body, eol = _split_trailing_eol(raw_block)
            idx = len(protected_blocks)
            protected_blocks.append(block_body)
            out.append(f"%%DOCUS_CODE_BLOCK_{idx}%%{eol}")
        else:
            out.append(line)
            i += 1

    return "".join(out)


def convert_obsidian_callouts(content):
    """Convert Obsidian > [!type] callouts into Docusaurus :::type admonitions."""
    lines = content.splitlines(keepends=True)
    out = []
    i = 0
    n = len(lines)

    while i < n:
        m = CALLOUT_HEADER_RE.match(lines[i])
        if not m:
            out.append(lines[i])
            i += 1
            continue

        indent = m.group(1)
        raw_type = m.group(2).lower()
        title = (m.group(4) or "").strip()
        eol = m.group(5) or "\n"

        admon_type = CALLOUT_TYPE_MAP.get(raw_type, "note")
        if not title and raw_type not in NATIVE_ADMONITIONS:
            title = raw_type.capitalize()

        if title:
            out.append(f"{indent}:::{admon_type}[{title}]{eol}")
        else:
            out.append(f"{indent}:::{admon_type}{eol}")

        i += 1
        quote_re = re.compile(
            rf"^{re.escape(indent)}>(?:[ \t]?(.*))?(\r?\n|$)"
        )
        while i < n:
            qm = quote_re.match(lines[i])
            if not qm:
                break
            body_line = qm.group(1) or ""
            line_eol = qm.group(2) or ""
            if body_line:
                out.append(f"{indent}{body_line}{line_eol}")
            else:
                out.append(f"{indent}{line_eol}")
            i += 1

        # Ensure closing ::: starts on a new line even if the last quote line lacked EOL
        if out and not out[-1].endswith(("\n", "\r\n")):
            out[-1] += "\n"
        out.append(f"{indent}:::{eol}")

    return "".join(out)


BQ_ADMON_OPEN_RE = re.compile(
    r"^([ \t]*)>[ \t]*(:::(?:note|tip|info|warning|danger|caution)(?:\[[^\]]*\])?(?:[ \t]+.*?)?)[ \t]*(\r?\n|$)",
    re.IGNORECASE,
)
BQ_ADMON_CLOSE_RE = re.compile(r"^[ \t]*>[ \t]*:::[ \t]*(\r?\n|$)")


def unwrap_blockquote_admonitions(content):
    """Convert blockquote-wrapped Docusaurus admonitions (> :::info ... > :::) to clean :::info ... :::."""
    lines = content.splitlines(keepends=True)
    out = []
    i = 0
    n = len(lines)

    while i < n:
        m = BQ_ADMON_OPEN_RE.match(lines[i])
        if not m:
            out.append(lines[i])
            i += 1
            continue

        indent = m.group(1)
        header = m.group(2)
        eol = m.group(3) or "\n"
        quote_re = re.compile(rf"^{re.escape(indent)}>(?:[ \t]?(.*))?(\r?\n|$)")

        j = i + 1
        inner = []
        closed = False
        while j < n:
            if BQ_ADMON_CLOSE_RE.match(lines[j]):
                closed = True
                break
            qm = quote_re.match(lines[j])
            if not qm:
                break
            body_line = qm.group(1) or ""
            line_eol = qm.group(2) or ""
            inner.append(f"{indent}{body_line}{line_eol}" if body_line else f"{indent}{line_eol}")
            j += 1

        if not closed:
            out.append(lines[i])
            i += 1
            continue

        out.append(f"{indent}{header}{eol}")
        out.extend(inner)
        if out and not out[-1].endswith(("\n", "\r\n")):
            out[-1] += "\n"
        close_eol = BQ_ADMON_CLOSE_RE.match(lines[j]).group(1) or "\n"
        out.append(f"{indent}:::{close_eol}")
        i = j + 1

    return "".join(out)


def _format_last_update_yaml(date_str, author_str):
    lines = ["last_update:", f"  date: {date_str}"]
    if author_str:
        safe_author = author_str.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'  author: "{safe_author}"')
    return "\n".join(lines)


def build_git_lastmod_map(base_dir):
    """Read last commit date and author for files under content_staging in one git call."""
    staging_dir = os.path.join(base_dir, "content_staging")
    if not os.path.isdir(staging_dir):
        return {}

    try:
        output = subprocess.check_output(
            [
                "git",
                "-C",
                base_dir,
                "-c",
                "core.quotepath=false",
                "log",
                "--format=___COMMIT___%cI|%an",
                "--name-only",
                "--",
                "content_staging",
            ],
            text=True,
            encoding="utf-8",
            stderr=subprocess.DEVNULL,
        )
    except (subprocess.SubprocessError, FileNotFoundError):
        return {}

    lastmod = {}
    current_date = None
    current_author = ""
    for line in output.splitlines():
        if line.startswith("___COMMIT___"):
            meta = line[len("___COMMIT___") :]
            date_part, _, author_part = meta.partition("|")
            current_date = date_part[:10] if len(date_part) >= 10 else None
            current_author = author_part.strip()
        elif line.strip() and current_date:
            rel_path = line.strip()
            if rel_path not in lastmod:
                lastmod[rel_path] = (current_date, current_author)

    return lastmod


def resolve_doc_git_info(filepath, base_dir, git_lastmod_map):
    """Map synced docs file path back to its content_staging source for Git metadata.

    Only docs files receive `last_update` frontmatter; blog posts do not support it.
    """
    if not git_lastmod_map:
        return None

    rel = os.path.relpath(filepath, base_dir).replace(os.sep, "/")
    if rel.startswith("docs/"):
        sub = rel[len("docs/") :]
        return git_lastmod_map.get(f"content_staging/Wiki/{sub}")

    m = re.match(
        r"^i18n/([^/]+)/docusaurus-plugin-content-docs/current/(.+)$", rel
    )
    if m:
        locale, sub = m.group(1), m.group(2)
        return git_lastmod_map.get(f"content_staging/i18n/{locale}/Wiki/{sub}")

    return None


def _copy_tree_contents(src_dir, dst_dir, preserve_files=()):
    if not os.path.isdir(src_dir):
        return 0
    copied = 0
    for root, _, files in os.walk(src_dir):
        rel = os.path.relpath(root, src_dir)
        target_dir = dst_dir if rel == "." else os.path.join(dst_dir, rel)
        os.makedirs(target_dir, exist_ok=True)
        for fname in files:
            src_file = os.path.join(root, fname)
            dst_file = os.path.join(target_dir, fname)
            rel_file = (
                fname if rel == "." else os.path.join(rel, fname).replace(os.sep, "/")
            )
            if rel_file in preserve_files and os.path.exists(dst_file):
                continue
            shutil.copy2(src_file, dst_file)
            copied += 1
    return copied


def _clean_directory(target_dir, preserve_names=(), preserve_exts=()):
    if not os.path.isdir(target_dir):
        return
    for entry in os.listdir(target_dir):
        full_path = os.path.join(target_dir, entry)
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)
        else:
            if entry in preserve_names or any(
                entry.endswith(ext) for ext in preserve_exts
            ):
                continue
            os.remove(full_path)


def prepare_from_staging(base_dir):
    """Sync content_staging/{Wiki,Blog,i18n} into Docusaurus runtime folders."""
    staging_dir = os.path.join(base_dir, "content_staging")
    docs_dir = os.path.join(base_dir, "docs")
    blog_dir = os.path.join(base_dir, "blog")
    static_img_dir = os.path.join(base_dir, "static", "img")

    os.makedirs(docs_dir, exist_ok=True)
    os.makedirs(blog_dir, exist_ok=True)
    os.makedirs(static_img_dir, exist_ok=True)

    _clean_directory(docs_dir, preserve_names=(".gitkeep", "index.md"))
    _clean_directory(blog_dir, preserve_names=(".gitkeep",))

    wiki_count = _copy_tree_contents(os.path.join(staging_dir, "Wiki"), docs_dir)
    blog_count = _copy_tree_contents(os.path.join(staging_dir, "Blog"), blog_dir)

    i18n_staging = os.path.join(staging_dir, "i18n")
    i18n_count = 0
    if os.path.isdir(i18n_staging):
        for locale in sorted(os.listdir(i18n_staging)):
            locale_src = os.path.join(i18n_staging, locale)
            if not os.path.isdir(locale_src):
                continue

            locale_docs_dst = os.path.join(
                base_dir, "i18n", locale, "docusaurus-plugin-content-docs", "current"
            )
            locale_blog_dst = os.path.join(
                base_dir, "i18n", locale, "docusaurus-plugin-content-blog"
            )

            if os.path.isdir(os.path.join(locale_src, "Wiki")):
                _clean_directory(locale_docs_dst)
                os.makedirs(locale_docs_dst, exist_ok=True)
                i18n_count += _copy_tree_contents(
                    os.path.join(locale_src, "Wiki"), locale_docs_dst
                )

            if os.path.isdir(os.path.join(locale_src, "Blog")):
                _clean_directory(locale_blog_dst, preserve_exts=(".json",))
                os.makedirs(locale_blog_dst, exist_ok=True)
                i18n_count += _copy_tree_contents(
                    os.path.join(locale_src, "Blog"), locale_blog_dst
                )

    print(
        f"📂 Staging sync complete: wiki={wiki_count}, blog={blog_count}, i18n={i18n_count}"
    )


def fix_unquoted_html_attributes(content):
    """Merge check-mdx.py rule: quote bare HTML attributes safely and sanitize inner apostrophes in single-quoted URLs."""

    # Fix single-quoted src='https://...' or href='https://...' containing unescaped apostrophes (e.g. version's, haven't)
    content = re.sub(
        r"""(\b(?:src|href)\s*=\s*)'(https?://[^>\n]*?)'(?=\s+[a-zA-Z_:-]+\s*=|\s*/?>)""",
        lambda m: f'{m.group(1)}"{m.group(2).replace(chr(39), "%27")}"',
        content,
    )

    def attr_replacer(m):
        full_match = m.group(0)
        attr_name = m.group(1)
        bare_val = m.group(2)
        if bare_val is None:
            return full_match
        if "?" in attr_name or "?" in bare_val or "&" in bare_val:
            return full_match
        return f'{attr_name}="{bare_val}"'

    def tag_fixer(tag_match):
        tag_name = tag_match.group(1)
        attrs = tag_match.group(2)
        self_close = tag_match.group(3)
        fixed_attrs = ATTR_TOKEN_RE.sub(attr_replacer, attrs)
        return f"<{tag_name}{fixed_attrs}{self_close}>"

    return TAG_WITH_ATTRS_RE.sub(tag_fixer, content)


def process_file(filepath, base_dir=BASE_DIR, git_lastmod_map=None):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)
    modified = False

    # 0. Protect fenced code blocks (3+ backticks / ~~~) and inline code spans
    protected_blocks = []

    def save_inline_code(match):
        protected_blocks.append(match.group(0))
        return f"%%DOCUS_CODE_BLOCK_{len(protected_blocks) - 1}%%"

    content = extract_fenced_blocks(content, protected_blocks)
    content = INLINE_CODE_RE.sub(save_inline_code, content)

    # 1. Frontmatter cleanup & optional Docs Git last_update injection
    doc_git_info = resolve_doc_git_info(filepath, base_dir, git_lastmod_map)
    fm_match = FRONTMATTER_RE.match(content)
    if fm_match:
        fm_raw = fm_match.group(1)
        fm_eol = fm_match.group(2) or "\n"
        fm_clean = re.sub(r"^image:\s*null\s*$", "", fm_raw, flags=re.M)
        fm_clean = re.sub(r"^id:\s+.*$", "", fm_clean, flags=re.M)
        fm_clean = re.sub(r"\n{2,}", "\n", fm_clean.strip())

        if doc_git_info and not re.search(r"^last_update\s*:", fm_clean, flags=re.M):
            lu_block = _format_last_update_yaml(*doc_git_info)
            fm_clean = f"{fm_clean}\n{lu_block}" if fm_clean else lu_block

        if fm_clean != fm_raw:
            content = f"---\n{fm_clean}\n---{fm_eol}" + content[fm_match.end() :]
            modified = True
    elif EMPTY_FRONTMATTER_RE.match(content):
        if doc_git_info:
            em = EMPTY_FRONTMATTER_RE.match(content)
            fm_eol = em.group(1) or "\n"
            lu_block = _format_last_update_yaml(*doc_git_info)
            content = f"---\n{lu_block}\n---{fm_eol}" + content[em.end() :]
            modified = True
    elif doc_git_info:
        lu_block = _format_last_update_yaml(*doc_git_info)
        content = f"---\n{lu_block}\n---\n\n{content}"
        modified = True

    # 2. Common typos
    if "[]()" in content:
        content = content.replace("[]()", "[#](#)")
        modified = True

    if "herf=" in content:
        content = content.replace("herf=", "href=")
        print(f"  [Fixed herf] -> {fname}")
        modified = True

    # 3. Quote unquoted HTML attributes (merged from check-mdx.py)
    quoted_content = fix_unquoted_html_attributes(content)
    if quoted_content != content:
        content = quoted_content
        print(f"  [Fixed AttrQuotes] -> {fname}")
        modified = True

    # 4. HTML style="color|zoom: ..." -> JSX style={{...}}
    def universal_style_to_jsx(match):
        before = match.group(1)
        attr = match.group(3).lower()
        val = match.group(4).strip()
        after = match.group(5)
        jsx_prop = "width" if attr == "zoom" else "color"
        print(f"  [Fixed Style] -> {fname}: {attr} to JSX {jsx_prop}")
        return f'{before} style={{{{{jsx_prop}: "{val}"}}}}{after}'

    content = STYLE_ATTR_RE.sub(universal_style_to_jsx, content)

    # 5. Obsidian image resize syntax
    def ob_link_img(m):
        alt, w, img, link = m.group(1), m.group(2), m.group(3), m.group(4)
        print(f"  [Fixed LinkedImg] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return (
            f'<a href="{link.replace("&", "&amp;")}">'
            f'<img src="{img}" alt="{alt}" style={{{{ width: "{width_val}", height: "auto" }}}} /></a>'
        )

    content = re.sub(
        r"\[!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)\]\((.*?)\)", ob_link_img, content
    )

    def ob_img(m):
        alt, w, img = m.group(1), m.group(2), m.group(3)
        print(f"  [Fixed Img] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return (
            f'<img src="{img}" alt="{alt}" style={{{{ width: "{width_val}", height: "auto" }}}} />'
        )

    content = re.sub(r"!\[([^|\]]*)\|(\d+%?)\]\((.*?)\)", ob_img, content)

    def ob_wiki_img(m):
        img, w = m.group(1), m.group(2)
        print(f"  [Fixed WikiImg] -> {fname}")
        width_val = f"{w}" if "%" in w else f"{w}px"
        return (
            f'<img src="./{img}" alt="{img}" style={{{{ width: "{width_val}", height: "auto" }}}} />'
        )

    content = re.sub(r"!\[\[([^|\]]+)\|(\d+%?)\]\]", ob_wiki_img, content)

    # 6. Obsidian Callouts -> Docusaurus Admonitions & unwrap > :::admonition blocks
    callout_content = convert_obsidian_callouts(content)
    callout_content = unwrap_blockquote_admonitions(callout_content)
    if callout_content != content:
        content = callout_content
        print(f"  [Fixed Callout] -> {fname}")
        modified = True

    # 7. HTML structure fixes (Ruby </a>, cross-nested tags, self-closing <img>)
    content = re.sub(r"(<a [^>]*>[^<]+)(<rt\b)", r"\1</a>\2", content)

    for t1, t2 in CROSS_TAG_PAIRS:
        content = re.sub(
            rf"(<{t1}\b[^>]*>\s*<{t2}\b[^>]*>[\s\S]*?)</{t1}></{t2}>",
            rf"\1</{t2}></{t1}>",
            content,
            flags=re.IGNORECASE,
        )

    content = re.sub(r"(<img\b[^>]+?)(?<!/)>", r"\1 />", content)

    # 8. Restore protected code blocks in reverse order
    for idx in range(len(protected_blocks) - 1, -1, -1):
        content = content.replace(f"%%DOCUS_CODE_BLOCK_{idx}%%", protected_blocks[idx])

    if content != original or modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    parser = argparse.ArgumentParser(
        description="Prepare content_staging and convert Obsidian Markdown for Docusaurus MDX."
    )
    parser.add_argument(
        "--prepare",
        action="store_true",
        help="Sync content_staging/{Wiki,Blog,i18n} into docs/, blog/, and i18n/ before fixing.",
    )
    args = parser.parse_args()

    if args.prepare:
        prepare_from_staging(BASE_DIR)

    print("🚀 Starting MDX Fixer (Unified Production Version)...")
    git_lastmod_map = build_git_lastmod_map(BASE_DIR)
    count = 0

    for folder in ("blog", "docs", "i18n"):
        target_dir = os.path.join(BASE_DIR, folder)
        if not os.path.isdir(target_dir):
            continue
        for root, _, files in os.walk(target_dir):
            for file in sorted(files):
                if file.endswith((".md", ".mdx")):
                    if process_file(
                        os.path.join(root, file),
                        base_dir=BASE_DIR,
                        git_lastmod_map=git_lastmod_map,
                    ):
                        count += 1

    print(f"✅ Finished! Total files processed and cleaned: {count}")


if __name__ == "__main__":
    main()
