'use client';

const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

interface RichContentProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders HTML from the rich editor. Falls back to plain-text rendering
 * for legacy content that was saved before the editor was introduced.
 */
export const RichContent = ({ html, className = '', style }: RichContentProps) => {
  if (!html) return null;

  if (isHtml(html)) {
    return (
      <div
        className={`rich-content ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Legacy plain text — render as-is with whitespace preserved
  return (
    <p
      className={className}
      style={{ whiteSpace: 'pre-wrap', ...style }}
    >
      {html}
    </p>
  );
};
