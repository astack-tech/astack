'use client';

import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

import type { SearchEntry } from '@/lib/search';
import { KIND_HUE, parseSearchIndex, search, tokenize } from '@/lib/search-query';
import { useMounted } from '@/lib/use-mounted';

let indexPromise: Promise<SearchEntry[]> | undefined;

function loadIndex(): Promise<SearchEntry[]> {
  indexPromise ??= fetch('/search-index.json')
    .then(async response => (response.ok ? parseSearchIndex(await response.json()) : []))
    .catch(() => {
      indexPromise = undefined;
      return [];
    });
  return indexPromise;
}

/** Wraps the query words in <mark>. */
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) {
    return <>{text}</>;
  }
  const pattern = new RegExp(
    `(${tokens.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 === 1 ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>
      )}
    </>
  );
}

/**
 * Site search: a button in the header and a dialog. Opens with ⌘K, Ctrl+K or "/".
 * The index is a static JSON file, fetched the first time the dialog opens.
 */
export default function Search() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const mounted = useMounted();
  // The shortcut label follows the platform once the page runs in the browser.
  const shortcut = mounted && !/Mac|iPhone|iPad/.test(navigator.userAgent) ? 'Ctrl K' : '⌘K';

  const groups = useMemo(() => search(index, query), [index, query]);
  const flat = useMemo(() => groups.flatMap(group => group.entries), [groups]);
  // Where each group starts in the flat list, so arrow keys run across groups.
  const offsets = useMemo(
    () => groups.map((_, i) => groups.slice(0, i).reduce((sum, g) => sum + g.entries.length, 0)),
    [groups]
  );
  const tokens = useMemo(() => tokenize(query), [query]);

  const open = useCallback(() => {
    const element = dialog.current;
    if (element === null || element.open) {
      return;
    }
    // Below the supported browsers, a dialog without showModal() still opens in place.
    if (typeof element.showModal === 'function') {
      element.showModal();
    } else {
      element.setAttribute('open', '');
    }
    input.current?.select();
    void loadIndex().then(setIndex);
  }, []);

  const close = useCallback(() => {
    const element = dialog.current;
    if (typeof element?.close === 'function') {
      element.close();
    } else {
      element?.removeAttribute('open');
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const { target } = event;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Keep the highlighted result in view while the arrow keys move through the list.
  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${String(active)}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (entry: SearchEntry | undefined) => {
    if (entry === undefined) {
      return;
    }
    close();
    router.push(entry.url);
  };

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (flat.length > 0) {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((active + step + flat.length) % flat.length);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(flat[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return (
    <>
      <button type="button" className="search-button" onClick={open} aria-label="Search">
        <MagnifyingGlassIcon size={16} aria-hidden="true" />
        <span className="search-button-label">Search</span>
        <kbd className="search-button-key">{shortcut}</kbd>
      </button>
      <dialog
        ref={dialog}
        className="search"
        aria-label="Search the site"
        onClick={event => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className="search-panel">
          <div className="search-field">
            <MagnifyingGlassIcon size={20} aria-hidden="true" />
            <input
              ref={input}
              type="search"
              value={query}
              placeholder="Search docs, API, examples"
              aria-label="Search"
              aria-controls={listId}
              aria-activedescendant={flat.length > 0 ? `${listId}-${String(active)}` : undefined}
              autoComplete="off"
              spellCheck={false}
              onChange={event => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
            />
            <button type="button" className="search-close" onClick={close}>
              Esc
            </button>
          </div>

          <ul ref={list} id={listId} className="search-results" role="listbox" aria-label="Results">
            {groups.map((group, groupIndex) => (
              <li key={group.kind} role="presentation">
                <p className="search-group">
                  {tokens.length === 0 ? 'Suggested' : group.kind}
                </p>
                <ul role="presentation">
                  {group.entries.map((entry, entryIndex) => {
                    const current = (offsets[groupIndex] ?? 0) + entryIndex;
                    return (
                      <li
                        key={entry.url}
                        id={`${listId}-${String(current)}`}
                        role="option"
                        aria-selected={current === active}
                        data-index={current}
                        className="search-result"
                        onMouseMove={() => {
                          if (current !== active) {
                            setActive(current);
                          }
                        }}
                        onClick={() => {
                          go(entry);
                        }}
                      >
                        <span className={`search-kind block hue-${KIND_HUE[entry.kind]}`} />
                        <span className="search-text">
                          <span className="search-title">
                            <span>
                              <Highlight text={entry.title} tokens={tokens} />
                            </span>
                            {entry.parent !== undefined && (
                              <span className="search-parent">{entry.parent}</span>
                            )}
                          </span>
                          {entry.text && (
                            <span className="search-snippet">
                              <Highlight text={entry.text} tokens={tokens} />
                            </span>
                          )}
                        </span>
                        <ArrowRightIcon size={14} className="search-go" aria-hidden="true" />
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
            {tokens.length > 0 && flat.length === 0 && (
              <li className="search-empty" role="presentation">
                {index.length === 0 ? 'Loading…' : `No results for “${query.trim()}”.`}
              </li>
            )}
          </ul>

          <p className="search-help" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move
            </span>
            <span>
              <kbd>↵</kbd> to open
            </span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </p>
        </div>
      </dialog>
    </>
  );
}
