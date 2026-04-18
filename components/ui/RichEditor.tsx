'use client';

import { useRef, useEffect } from 'react';
import { Bold, Italic, Link, Undo, Redo } from 'lucide-react';

const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

/** Convert legacy plain text (double-newline paragraphs) to HTML on first load. */
const toHtml = (value: string): string => {
  if (!value) return '';
  if (isHtml(value)) return value;
  return value
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

interface ToolBtnProps {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolBtn = ({ title, onClick, children }: ToolBtnProps) => (
  <button
    type="button"
    title={title}
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    style={{
      padding: '5px 8px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      background: 'transparent',
      color: '#6b6b68',
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.1s',
    }}
    onMouseOver={e => (e.currentTarget.style.background = '#e8ddd0')}
    onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
  >
    {children}
  </button>
);

const Divider = () => (
  <div style={{ width: 1, background: '#e8ddd0', margin: '3px 4px', alignSelf: 'stretch' }} />
);

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  labelStyle?: React.CSSProperties;
  minHeight?: number;
  placeholder?: string;
  accentColor?: string;
  headerStyle?: React.CSSProperties;
  footerNote?: string;
}

export const RichEditor = ({
  value,
  onChange,
  label,
  labelStyle,
  minHeight = 200,
  placeholder = 'Start writing…',
  accentColor = '#4a6741',
  headerStyle,
  footerNote,
}: RichEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialise editor content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = toHtml(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const handleLink = () => {
    const url = prompt('Enter URL (e.g. https://example.com):');
    if (url) exec('createLink', url);
  };

  const defaultLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#6b6b68',
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <div>
      {label && (
        <label style={{ ...defaultLabelStyle, ...labelStyle }}>{label}</label>
      )}

      <div style={{ border: '1px solid #e8ddd0', borderRadius: 10, overflow: 'hidden', background: '#faf7f2' }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '7px 10px',
            borderBottom: '1px solid #e8ddd0',
            background: '#fff9f4',
            flexWrap: 'wrap',
            ...headerStyle,
          }}
        >
          <ToolBtn title="Bold"   onClick={() => exec('bold')}><Bold   size={14} /></ToolBtn>
          <ToolBtn title="Italic" onClick={() => exec('italic')}><Italic size={14} /></ToolBtn>
          <Divider />
          <ToolBtn title="Heading 1" onClick={() => exec('formatBlock', 'h1')}>
            <span style={{ fontSize: 12 }}>H1</span>
          </ToolBtn>
          <ToolBtn title="Heading 2" onClick={() => exec('formatBlock', 'h2')}>
            <span style={{ fontSize: 12 }}>H2</span>
          </ToolBtn>
          <ToolBtn title="Heading 3" onClick={() => exec('formatBlock', 'h3')}>
            <span style={{ fontSize: 12 }}>H3</span>
          </ToolBtn>
          <Divider />
          <ToolBtn title="Insert link" onClick={handleLink}><Link size={14} /></ToolBtn>
          <Divider />
          <ToolBtn title="Undo" onClick={() => exec('undo')}><Undo size={14} /></ToolBtn>
          <ToolBtn title="Redo" onClick={() => exec('redo')}><Redo size={14} /></ToolBtn>
        </div>

        {/* Editable content area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
          style={{
            minHeight,
            padding: '14px 16px',
            outline: 'none',
            fontSize: 15,
            lineHeight: 1.75,
            color: '#2c2c2a',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        />

        {footerNote && (
          <div style={{ padding: '7px 14px', borderTop: '1px solid #e8ddd0', fontSize: 11, color: '#6b6b68', background: '#fff9f4' }}>
            {footerNote}
          </div>
        )}
      </div>

      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #c4b49e;
          pointer-events: none;
        }
        [contenteditable] a { color: ${accentColor}; text-decoration: underline; }
        [contenteditable] h1 { font-size: 1.8rem; font-weight: 400; margin: 0.75rem 0 0.4rem; }
        [contenteditable] h2 { font-size: 1.4rem; font-weight: 400; margin: 0.6rem 0 0.35rem; }
        [contenteditable] h3 { font-size: 1.1rem; font-weight: 500; margin: 0.5rem 0 0.3rem; }
        [contenteditable] p  { margin: 0 0 0.75rem; }
        [contenteditable] p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
};
