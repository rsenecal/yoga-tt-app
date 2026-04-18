'use client';

import { Play } from 'lucide-react';

export const VideoPlayer = ({ url }: { url?: string }) => {
  if (!url) return null;
  let embedUrl = '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('vimeo.com')) {
    embedUrl = `https://player.vimeo.com/video/${url.split('/').pop()}`;
  }
  if (!embedUrl) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--terracotta)', fontWeight: 500, fontSize: 14 }}>
        <Play size={16} fill="currentColor" />
        <span>Video Demonstration</span>
      </div>
      <div className="aspect-video w-full rounded-2xl overflow-hidden" style={{ background: '#000' }}>
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video" />
      </div>
    </div>
  );
};
