import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import './Terminal.css';
import { useGlobalState } from '../../hooks/useGlobalState';
import {
    executeCommand,
    complete,
    getPrompt,
    initialSession,
    welcomeLines
} from '../../services/commands';

const MIN_WIDTH = 280;
const MIN_HEIGHT = 160;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 400;
const MAX_ENTRIES = 300;

// Edges and corners that can be grabbed to resize
const RESIZE_HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getInitialRect = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(DEFAULT_WIDTH, vw);
    const height = Math.min(DEFAULT_HEIGHT, vh);

    return {
        x: Math.max((vw - width) / 2, 0),
        y: Math.max((vh - height) / 2, 0),
        width,
        height
    };
};


/* ---------- Small presentational pieces ---------- */

const Prompt = ({ prompt }) => (
    <span className="terminal-prompt">
        <span className="t-success">{prompt.user}</span>
        <span className="t-muted">:</span>
        <span className="t-path">{prompt.path}</span>
        <span className="t-muted">$</span>{' '}
    </span>
);

const OutputLine = ({ line }) => (
    <div className="terminal-out-line">
        {line.parts.map((part, i) =>
            part.href ? (
                <a
                    key={i}
                    className="t-link"
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {part.text}
                </a>
            ) : (
                <span key={i} className={`t-${part.kind}`}>
                    {part.text}
                </span>
            )
        )}
    </div>
);


const Terminal = () => {

    const { setIsTerminalOpen } = useGlobalState();

    /* ---------- Window position and size ---------- */

    const [rect, setRect] = useState(getInitialRect);
    const [isInteracting, setIsInteracting] = useState(false);

    const rectRef = useRef(rect);
    rectRef.current = rect;

    const cleanupRef = useRef(null);
    useEffect(() => () => cleanupRef.current?.(), []);

    /* ---------- Shell state ---------- */

    const [entries, setEntries] = useState(() => [{ id: 0, lines: welcomeLines }]);
    const [input, setInput] = useState('');
    const [session, setSession] = useState(initialSession);
    const [history, setHistory] = useState([]);

    const inputRef = useRef(null);
    const contentRef = useRef(null);
    const entryId = useRef(1);
    const historyIndex = useRef(null); // null = not browsing history
    const draft = useRef('');          // what was typed before pressing ↑

    const prompt = getPrompt(session);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Always keep the newest output in view
    useLayoutEffect(() => {
        const el = contentRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [entries, input]);


    // Keep the window inside the viewport when the browser is resized
    useEffect(() => {
        const handleWindowResize = () => {
            setRect((prev) => {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const width = Math.min(prev.width, vw);
                const height = Math.min(prev.height, vh);

                return {
                    width,
                    height,
                    x: clamp(prev.x, 0, vw - width),
                    y: clamp(prev.y, 0, vh - height)
                };
            });
        };

        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);


    /* ---------- Drag and resize ---------- */

    // mode is either 'drag' or a resize direction such as 'n', 'se', 'w'
    const startInteraction = useCallback((event, mode) => {
        if (event.button !== undefined && event.button !== 0) return;

        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;
        const start = { ...rectRef.current };

        setIsInteracting(true);

        const handleMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            if (mode === 'drag') {
                setRect({
                    ...start,
                    x: clamp(start.x + dx, 0, vw - start.width),
                    y: clamp(start.y + dy, 0, vh - start.height)
                });
                return;
            }

            let left = start.x;
            let top = start.y;
            let right = start.x + start.width;
            let bottom = start.y + start.height;

            if (mode.includes('w')) left = clamp(start.x + dx, 0, right - MIN_WIDTH);
            if (mode.includes('e')) right = clamp(start.x + start.width + dx, left + MIN_WIDTH, vw);
            if (mode.includes('n')) top = clamp(start.y + dy, 0, bottom - MIN_HEIGHT);
            if (mode.includes('s')) bottom = clamp(start.y + start.height + dy, top + MIN_HEIGHT, vh);

            setRect({
                x: left,
                y: top,
                width: right - left,
                height: bottom - top
            });
        };

        const stop = () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', stop);
            window.removeEventListener('pointercancel', stop);
            cleanupRef.current = null;
            setIsInteracting(false);
            inputRef.current?.focus();
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', stop);
        window.addEventListener('pointercancel', stop);
        cleanupRef.current = stop;
    }, []);


    /* ---------- Running commands ---------- */

    const addEntry = useCallback((entry) => {
        setEntries((prev) =>
            [...prev, { id: entryId.current++, ...entry }].slice(-MAX_ENTRIES)
        );
    }, []);

    const run = (raw) => {
        const trimmed = raw.trim();

        historyIndex.current = null;
        setInput('');

        // Empty Enter just moves to a fresh prompt, like a real shell
        if (!trimmed) {
            addEntry({ prompt, command: raw, lines: [] });
            return;
        }

        const nextHistory = [...history, trimmed];
        setHistory(nextHistory);

        const result = executeCommand(trimmed, { session, history: nextHistory });

        if (result.action?.type === 'clear') {
            setEntries([]);
        } else {
            addEntry({ prompt, command: raw, lines: result.lines });
        }

        setSession(result.session);

        if (result.action?.type === 'open') {
            window.open(result.action.url, '_blank', 'noopener,noreferrer');
        }

        if (result.action?.type === 'exit') {
            // Short pause so the "logout" message is visible before the window closes
            setTimeout(() => setIsTerminalOpen(false), 400);
        }
    };

    const navigateHistory = (direction) => {
        if (!history.length) return;

        if (historyIndex.current === null) {
            draft.current = input;
            historyIndex.current = history.length;
        }

        const next = historyIndex.current + direction;
        if (next < 0) return;

        if (next >= history.length) {
            historyIndex.current = null;
            setInput(draft.current);
            return;
        }

        historyIndex.current = next;
        setInput(history[next]);
    };

    const handleTab = () => {
        const { value, lines } = complete(input, session);
        setInput(value);

        if (lines.length) {
            addEntry({ prompt, command: input, lines });
        }
    };

    const handleKeyDown = (event) => {
        const ctrl = event.ctrlKey || event.metaKey;

        if (event.key === 'Enter') {
            event.preventDefault();
            run(input);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateHistory(1);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            handleTab();
        } else if (ctrl && event.key.toLowerCase() === 'l') {
            event.preventDefault();
            setEntries([]);
        } else if (ctrl && event.key.toLowerCase() === 'c') {
            // Let Ctrl+C copy when text is selected, otherwise cancel the line
            const el = event.currentTarget;
            if (el.selectionStart !== el.selectionEnd) return;

            event.preventDefault();
            addEntry({ prompt, command: `${input}^C`, lines: [] });
            setInput('');
            historyIndex.current = null;
        } else if (ctrl && event.key.toLowerCase() === 'd' && !input) {
            event.preventDefault();
            run('exit');
        }
    };

    // Clicking anywhere in the output focuses the input, unless the user is selecting text
    const handleContentMouseUp = () => {
        if (!window.getSelection()?.toString()) {
            inputRef.current?.focus();
        }
    };


    return (
        <div
            className={`terminal-window${isInteracting ? ' is-interacting' : ''}`}
            style={{
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height
            }}
        >

            {/* Resize handles (edges + corners) */}
            {RESIZE_HANDLES.map((dir) => (
                <div
                    key={dir}
                    className={`terminal-resize terminal-resize-${dir}`}
                    onPointerDown={(e) => startInteraction(e, dir)}
                />
            ))}


            {/* Terminal Header (drag handle) */}
            <div
                className="terminal-header"
                onPointerDown={(e) => startInteraction(e, 'drag')}
            >

                <div className="terminal-dots">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                </div>

                <span className="terminal-title">
                    {prompt.user}: {prompt.path}
                </span>

                <button
                    className="terminal-close"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setIsTerminalOpen(false)}
                    aria-label="Close terminal"
                >
                    ×
                </button>

            </div>


            {/* Terminal Content */}
            <div
                className="terminal-content"
                ref={contentRef}
                onMouseUp={handleContentMouseUp}
            >

                {entries.map((entry) => (
                    <div className="terminal-entry" key={entry.id}>
                        {entry.command !== undefined && (
                            <div className="terminal-out-line">
                                <Prompt prompt={entry.prompt} />
                                <span>{entry.command}</span>
                            </div>
                        )}

                        {entry.lines.map((line, i) => (
                            <OutputLine key={i} line={line} />
                        ))}
                    </div>
                ))}

                {/* Live input line */}
                <div className="terminal-input-row">
                    <Prompt prompt={prompt} />
                    <input
                        ref={inputRef}
                        className="terminal-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        aria-label="Terminal input"
                    />
                </div>

            </div>

        </div>
    );
};

export default Terminal;