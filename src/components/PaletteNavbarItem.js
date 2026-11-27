import React, {useEffect, useState} from 'react';

export const PALETTE_STORAGE_KEY = 'kiwi-palette';
export const DEFAULT_PALETTE = 'amber';

export const PALETTES = [
  {
    id: 'amber',
    title: 'Amber',
    bg: '#121214',
    surface: '#19191d',
    accent: '#e3b341',
  },
  {
    id: 'minimal',
    title: 'Minimal',
    bg: '#111113',
    surface: '#18181b',
    accent: '#e4e4e7',
  },
  {
    id: 'nord',
    title: 'Nord',
    bg: '#2e3440',
    surface: '#3b4252',
    accent: '#88c0d0',
  },
  {
    id: 'tokyo',
    title: 'Tokyo Night',
    bg: '#1a1b26',
    surface: '#24283b',
    accent: '#7aa2f7',
  },
  {
    id: 'catppuccin',
    title: 'Catppuccin',
    bg: '#1e1e2e',
    surface: '#181825',
    accent: '#89b4fa',
  },
  {
    id: 'rosepine',
    title: 'Rosé Pine',
    bg: '#191724',
    surface: '#1f1d2e',
    accent: '#f6c177',
  },
];

function applyPalette(paletteId) {
  const valid = PALETTES.some((p) => p.id === paletteId);
  const nextId = valid ? paletteId : DEFAULT_PALETTE;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-palette', nextId);
  }
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, nextId);
  } catch {
    // ignore storage errors in private browsing
  }
  return nextId;
}

function ContrastTile({item, isActive, onSelect}) {
  return (
    <button
      type="button"
      title={item.title}
      aria-label={item.title}
      aria-pressed={isActive}
      className={`kiwi-palette-tile ${isActive ? 'kiwi-palette-tile--active' : ''}`}
      style={{background: item.bg}}
      onClick={(e) => onSelect(item.id, e)}>
      <span className="kiwi-palette-tile-surface" style={{background: item.surface}} />
      <span className="kiwi-palette-tile-accent" style={{background: item.accent}} />
    </button>
  );
}

export default function PaletteNavbarItem({mobile = false}) {
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PALETTE_STORAGE_KEY) || DEFAULT_PALETTE;
      setPalette(applyPalette(saved));
    } catch {
      setPalette(applyPalette(DEFAULT_PALETTE));
    }
  }, []);

  const handleSelect = (id, e) => {
    e.preventDefault();
    setPalette(applyPalette(id));
    setOpen(false);
  };

  const activeObj = PALETTES.find((p) => p.id === palette) || PALETTES[0];

  if (mobile) {
    return (
      <li className="menu__list-item kiwi-palette-mobile">
        <div className="kiwi-palette-grid kiwi-palette-grid--mobile" role="group" aria-label="Color palette">
          {PALETTES.map((item) => (
            <ContrastTile
              key={item.id}
              item={item}
              isActive={item.id === palette}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </li>
    );
  }

  return (
    <div
      className={`navbar__item dropdown dropdown--hoverable dropdown--right ${open ? 'dropdown--show' : ''}`}
      onMouseLeave={() => setOpen(false)}>
      <a
        href="#palette"
        role="button"
        title={activeObj.title}
        aria-label={activeObj.title}
        aria-haspopup="true"
        aria-expanded={open}
        className="navbar__link kiwi-palette-trigger"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}>
        <span className="kiwi-palette-pill">
          <span className="kiwi-palette-pill-half" style={{background: activeObj.bg}} />
          <span className="kiwi-palette-pill-half" style={{background: activeObj.accent}} />
        </span>
      </a>
      <div className="dropdown__menu kiwi-palette-dropdown">
        <div className="kiwi-palette-grid" role="group" aria-label="Color palette">
          {PALETTES.map((item) => (
            <ContrastTile
              key={item.id}
              item={item}
              isActive={item.id === palette}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
