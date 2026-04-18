'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Save, X, BookOpen, Users, Heart,
  Dumbbell, Book, Edit, Trash2,
  AlertCircle, CheckCircle2, Play, ArrowLeft, Tag, Award,
} from 'lucide-react';
import { RichEditor } from '@/components/ui/RichEditor';
import { groupAndSort } from '@/lib/groupAndSort';
import type { CategoryItem } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';

const TABS = [
  { id: 'postures',   label: 'Postures',   icon: Dumbbell,  collection: 'postures' },
  { id: 'anatomy',    label: 'Anatomy',    icon: Heart,     collection: 'anatomy_topics' },
  { id: 'philosophy', label: 'Philosophy', icon: Book,      collection: 'philosophy_topics' },
  { id: 'team',       label: 'Team',       icon: Users,     collection: 'team_members' },
  { id: 'modules',    label: 'Modules',    icon: BookOpen,  collection: 'modules' },
  { id: 'categories', label: 'Categories', icon: Tag,       collection: '' },
  { id: 'training',   label: 'Training',   icon: Award,     collection: 'training_info' },
];

const CATEGORY_COLLECTIONS: Record<string, string> = {
  postures:   'posture_categories',
  anatomy:    'anatomy_categories',
  philosophy: 'philosophy_categories',
};

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  charcoal: '#2c2c2a', midGray: '#6b6b68', lightGray: '#e8e6e0',
  cream: '#faf7f2', warmWhite: '#fff9f4', sand: '#e8ddd0', sandDark: '#c4b49e',
  sage: '#4a6741', sagePale: '#e8f0e6', sageMid: '#c5d9c2', sageLight: '#7a9e72',
  terracotta: '#b85c38', terracottaLight: '#d4795a', terracottaPale: '#f5e8e2',
  green: '#15803d', greenPale: '#dcfce7', red: '#dc2626', redPale: '#fee2e2',
};

// ─── SafeImage — plain <img> so any URL works (Dropbox, DO Spaces, etc.) ──────
const SafeImage = ({ src, alt, fill, style }: {
  src: string; alt: string; fill?: boolean; style?: React.CSSProperties;
}) => {
  const [errored, setErrored] = React.useState(false);
  const imgSrc = errored ? FALLBACK_IMG : (src || FALLBACK_IMG);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setErrored(true)}
      style={{
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center', display: 'block',
        ...(fill ? { position: 'absolute' as const, inset: 0 } : {}),
        ...style,
      }}
    />
  );
};

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px',
  border: `1px solid ${T.sand}`, borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14, color: T.charcoal,
  background: T.cream, outline: 'none', transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, letterSpacing: '0.08em',
  textTransform: 'uppercase' as const, color: T.midGray, marginBottom: 6, fontWeight: 500,
};

// ─── URL normaliser — converts share links into direct image URLs ─────────────
function normalizeImageUrl(url: string): string {
  // Google Drive: /file/d/FILE_ID/view  →  lh3.googleusercontent.com/d/FILE_ID
  const gdrive = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (gdrive) return `https://lh3.googleusercontent.com/d/${gdrive[1]}`;

  // Google Drive open?id= form
  const gdriveOpen = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (gdriveOpen) return `https://lh3.googleusercontent.com/d/${gdriveOpen[1]}`;

  // Dropbox: www.dropbox.com/s/… → dl.dropboxusercontent.com/s/… (strip dl= param)
  if (url.includes('dropbox.com')) {
    return url
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace(/[?&]dl=\d/, '');
  }

  return url;
}

// ─── Image URL field ──────────────────────────────────────────────────────────
const ImageUploadField = ({ formData, setFormData }: any) => {
  const handleUrlPaste = (raw: string) => {
    setFormData({ ...formData, imageUrl: normalizeImageUrl(raw.trim()) });
  };

  return (
    <div>
      <label style={labelStyle}>Image</label>

      {/* Preview */}
      {formData.imageUrl && (
        <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
          <SafeImage src={formData.imageUrl} alt="Preview" fill />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, imageUrl: '' })}
            style={{ position: 'absolute', top: 8, right: 8, background: T.red, color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        type="url"
        placeholder="Paste an image URL, Google Drive or Dropbox share link…"
        value={formData.imageUrl || ''}
        onChange={e => handleUrlPaste(e.target.value)}
        style={{ ...inputStyle, fontSize: 13 }}
      />
      <p style={{ fontSize: 11, color: T.midGray, marginTop: 6, lineHeight: 1.5 }}>
        Google Drive &amp; Dropbox share links are automatically converted to direct image URLs.
      </p>
    </div>
  );
};

// ─── Field group wrapper (must live at module level to avoid remount on rerender)
const FG = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
);

// ─── Posture form ─────────────────────────────────────────────────────────────
const PosturesForm = ({ formData, setFormData, alignmentCues, setAlignmentCues, categories }: any) => {
  const updateCue = (i: number, v: string) => {
    const next = [...alignmentCues]; next[i] = v;
    setAlignmentCues(next); setFormData({ ...formData, alignment: next });
  };
  const addCue = () => {
    const next = [...alignmentCues, ''];
    setAlignmentCues(next); setFormData({ ...formData, alignment: next });
  };
  const removeCue = (i: number) => {
    const next = alignmentCues.filter((_: any, idx: number) => idx !== i);
    setAlignmentCues(next); setFormData({ ...formData, alignment: next });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FG>
          <label style={labelStyle}>English name</label>
          <input style={inputStyle} value={formData.english_name || ''} onChange={e => setFormData({ ...formData, english_name: e.target.value })} />
        </FG>
        <FG>
          <label style={labelStyle}>Sanskrit name</label>
          <input style={inputStyle} value={formData.sanskrit_name || ''} onChange={e => setFormData({ ...formData, sanskrit_name: e.target.value })} />
        </FG>
      </div>
      <FG>
        <label style={labelStyle}>Category</label>
        <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
          <option value="">Select category…</option>
          {(categories ?? []).map((c: Category) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </FG>
      <ImageUploadField formData={formData} setFormData={setFormData} />
      <FG>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Play size={12} /> Video URL (YouTube / Vimeo)
        </label>
        <input style={inputStyle} type="url" placeholder="https://…" value={formData.videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
      </FG>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
        <FG>
          <label style={labelStyle}>Short description <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(shown on the posture card — plain text)</span></label>
          <input
            style={inputStyle}
            placeholder="e.g. A grounding standing pose that builds strength and stability…"
            value={formData.shortDescription || ''}
            onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
          />
        </FG>
        <FG>
          <label style={labelStyle}>Display order</label>
          <input
            type="number"
            style={{ ...inputStyle, width: 100 }}
            placeholder="e.g. 1"
            value={formData.order ?? ''}
            onChange={e => setFormData({ ...formData, order: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
        </FG>
      </div>
      <div>
        <label style={labelStyle}>Alignment cues</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alignmentCues.map((cue: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={cue} onChange={e => updateCue(i, e.target.value)} placeholder={`Cue ${i + 1}…`} />
              {alignmentCues.length > 1 && (
                <button type="button" onClick={() => removeCue(i)} style={{ padding: '8px 10px', border: `1px solid ${T.sand}`, borderRadius: 10, cursor: 'pointer', color: T.red, background: T.redPale }}>
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addCue} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 13, color: T.sage, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Add cue
        </button>
      </div>
      <RichEditor
        value={formData.dialogue || ''}
        onChange={html => setFormData({ ...formData, dialogue: html })}
        label="Teaching Dialogue"
        labelStyle={{ color: '#b85c38' }}
        minHeight={320}
        placeholder="Start typing the teaching script…"
        accentColor="#b85c38"
        footerNote="Use H1–H3 for section headings, Bold for emphasis. Each paragraph will flow as display text for students."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FG>
          <label style={labelStyle}>Benefits</label>
          <textarea rows={3} style={inputStyle} value={formData.benefits || ''} onChange={e => setFormData({ ...formData, benefits: e.target.value })} />
        </FG>
        <FG>
          <label style={labelStyle}>Key muscles (comma-separated)</label>
          <textarea rows={3} style={inputStyle} value={formData.key_muscles || ''} onChange={e => setFormData({ ...formData, key_muscles: e.target.value })} />
        </FG>
      </div>
    </div>
  );
};

// ─── Simple form ──────────────────────────────────────────────────────────────
const SimpleForm = ({ fields, formData, setFormData }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {fields.map((f: any) => {
      if (f.name === 'imageUrl') return (
        <ImageUploadField key={f.name} formData={formData} setFormData={setFormData} />
      );
      if (f.rich) return (
        <RichEditor
          key={f.name}
          value={formData[f.name] || ''}
          onChange={html => setFormData({ ...formData, [f.name]: html })}
          label={f.label || f.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())}
          minHeight={f.rows ? f.rows * 24 : 200}
          placeholder={f.placeholder}
        />
      );
      if (f.type === 'select') return (
        <div key={f.name}>
          <label style={labelStyle}>{f.label || f.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())}</label>
          <select style={inputStyle} value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}>
            <option value="">Select…</option>
            {(f.options ?? []).map((c: Category) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      );
      return (
        <div key={f.name}>
          <label style={labelStyle}>{f.label || f.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())}</label>
          {f.type === 'textarea' ? (
            <textarea rows={f.rows || 4} style={inputStyle} value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} />
          ) : (
            <input type={f.type || 'text'} style={inputStyle} value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Categories tab ───────────────────────────────────────────────────────────
type CatType = 'postures' | 'anatomy' | 'philosophy';
interface Category { id: string; name: string; }

const CategoriesTab = ({
  allCategories, onRefresh,
}: {
  allCategories: Record<CatType, Category[]>;
  onRefresh: () => Promise<void>;
}) => {
  const [subTab,     setSubTab]     = useState<CatType>('postures');
  const [newName,    setNewName]    = useState('');
  const [newOrder,   setNewOrder]   = useState('');
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [editName,   setEditName]   = useState('');
  const [editOrder,  setEditOrder]  = useState('');
  const [busy,       setBusy]       = useState(false);

  const col   = CATEGORY_COLLECTIONS[subTab];
  const items = allCategories[subTab] ?? [];

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    const data: any = { name };
    if (newOrder.trim()) data.order = Number(newOrder);
    await fetch('/api/admin/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: col, data }),
    });
    setNewName(''); setNewOrder('');
    setBusy(false);
    await onRefresh();
  };

  const handleSaveEdit = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    setBusy(true);
    const data: any = { name };
    if (editOrder.trim()) data.order = Number(editOrder);
    await fetch('/api/admin/update', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: col, id, data }),
    });
    setEditingId(null);
    setBusy(false);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await fetch('/api/admin/delete', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: col, id }),
    });
    await onRefresh();
  };

  const SUB_TABS: CatType[] = ['postures', 'anatomy', 'philosophy'];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: T.charcoal, fontStyle: 'italic', marginBottom: 4 }}>
          Categories
        </h2>
        <p style={{ fontSize: 12, color: T.midGray }}>Manage distinct categories for each content type.</p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: T.cream, padding: 4, borderRadius: 10, border: `1px solid ${T.sand}` }}>
        {SUB_TABS.map(t => (
          <button
            key={t}
            onClick={() => { setSubTab(t); setEditingId(null); setNewName(''); }}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: subTab === t ? T.charcoal : 'transparent',
              color: subTab === t ? '#fff' : T.midGray,
              fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', background: T.warmWhite, borderRadius: 12, border: `1px dashed ${T.sandDark}`, color: T.midGray, fontSize: 14 }}>
            No {subTab} categories yet — add one below.
          </div>
        )}
        {items.map(cat => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: T.warmWhite, border: `1px solid ${T.sand}`, borderRadius: 10 }}>
            {editingId === cat.id ? (
              <>
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(cat.id); if (e.key === 'Escape') setEditingId(null); }}
                  style={{ ...inputStyle, flex: 1, padding: '6px 10px' }}
                  placeholder="Category name"
                />
                <input
                  type="number"
                  value={editOrder}
                  onChange={e => setEditOrder(e.target.value)}
                  style={{ ...inputStyle, width: 72, padding: '6px 10px' }}
                  placeholder="Order"
                />
                <button onClick={() => handleSaveEdit(cat.id)} disabled={busy} style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: T.sage, color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid ${T.sand}`, background: 'transparent', color: T.midGray, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontSize: 14, color: T.charcoal }}>{cat.name}</span>
                {cat.order != null && (
                  <span style={{ fontSize: 11, color: T.midGray, background: T.cream, border: `1px solid ${T.sand}`, borderRadius: 6, padding: '2px 8px' }}>#{cat.order}</span>
                )}
                <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditOrder(cat.order != null ? String(cat.order) : ''); }} style={{ padding: '5px 8px', borderRadius: 7, border: `1px solid ${T.sand}`, background: T.cream, color: T.sage, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Edit size={13} />
                </button>
                <button onClick={() => handleDelete(cat.id)} style={{ padding: '5px 8px', borderRadius: 7, border: `1px solid ${T.sand}`, background: T.cream, color: T.red, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          placeholder={`New ${subTab} category…`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={{ ...inputStyle, flex: 1 }}
        />
        <input
          type="number"
          placeholder="Order"
          value={newOrder}
          onChange={e => setNewOrder(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={{ ...inputStyle, width: 80 }}
        />
        <button
          onClick={handleAdd}
          disabled={busy || !newName.trim()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: 'none', background: busy || !newName.trim() ? T.sageMid : T.sage, color: '#fff', fontSize: 13, cursor: busy || !newName.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};

// ─── Training settings panel ─────────────────────────────────────────────────
const TrainingSettingsPanel = () => {
  const [data,    setData]  = useState<any>({});
  const [docId,   setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/admin/list?collection=training_info');
        const d = await r.json();
        if (d.items?.length > 0) { setData(d.items[0]); setDocId(d.items[0].id); }
      } catch { /* empty collection is fine */ }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url    = docId ? '/api/admin/update' : '/api/admin/add';
      const method = docId ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'training_info', data, id: docId }),
      });
      if (r.ok) {
        if (!docId) {
          const d = await fetch('/api/admin/list?collection=training_info').then(x => x.json());
          if (d.items?.length > 0) setDocId(d.items[0].id);
        }
        showMsg('success', 'Training info saved');
      } else { showMsg('error', 'Save failed'); }
    } catch { showMsg('error', 'Network error'); }
    finally { setSaving(false); }
  };

  const field = (key: string, label: string, placeholder: string, hint?: string, textarea?: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: T.midGray, marginTop: -4 }}>{hint}</p>}
      {textarea ? (
        <textarea
          rows={4}
          style={inputStyle}
          placeholder={placeholder}
          value={data[key] || ''}
          onChange={e => setData((p: any) => ({ ...p, [key]: e.target.value }))}
        />
      ) : (
        <input
          style={inputStyle}
          placeholder={placeholder}
          value={data[key] || ''}
          onChange={e => setData((p: any) => ({ ...p, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: T.midGray }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${T.sand}`, borderTopColor: T.sage, borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.8s linear infinite' }} />
      Loading…
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: T.charcoal, fontStyle: 'italic', marginBottom: 4 }}>
          Training Info
        </h2>
        <p style={{ fontSize: 12, color: T.midGray }}>
          This information appears on the student dashboard and identifies your training program.
        </p>
      </div>

      {msg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: msg.type === 'success' ? '#f0faf4' : '#fff0f0', border: `1px solid ${msg.type === 'success' ? '#6aaa85' : '#e07070'}`, color: msg.type === 'success' ? '#2d6a4f' : '#a03030' }}>
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span style={{ fontSize: 13 }}>{msg.text}</span>
        </div>
      )}

      <div style={{ background: T.warmWhite, border: `1px solid ${T.sand}`, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Logo */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 14, border: `2px dashed ${T.sand}`, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {data.logoUrl
              ? <img src={data.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <Award size={28} style={{ color: T.sand }} />
            }
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Training Logo</label>
            <input
              type="url"
              style={{ ...inputStyle, fontSize: 13 }}
              placeholder="Paste an image URL, Google Drive or Dropbox share link…"
              value={data.logoUrl || ''}
              onChange={e => setData((p: any) => ({ ...p, logoUrl: normalizeImageUrl(e.target.value.trim()) }))}
            />
            <p style={{ fontSize: 11, color: T.midGray, margin: 0 }}>
              Google Drive &amp; Dropbox share links are automatically converted.
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: T.sand }} />

        {field('name', 'Training Name', 'e.g. 200hr Yoga Teacher Training')}
        {field('studioName', 'Studio / Organization Name', 'e.g. Sunrise Yoga Studio')}
        {field('tagline', 'Tagline', 'e.g. Deepen your practice. Find your voice.')}
        {field('description', 'Dashboard Description', 'A short paragraph describing this training program — shown on the student dashboard.', 'Keep it to 2–3 sentences. This is the first thing students see.', true)}
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: saving ? T.sageMid : T.sage, color: '#fff', border: 'none', fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
        >
          <Save size={15} /> {saving ? 'Saving…' : 'Save training info'}
        </button>
      </div>
    </div>
  );
};

// ─── Inline order input ───────────────────────────────────────────────────────
const OrderInput = ({ value, onSave }: { value?: number; onSave: (v: number | undefined) => void }) => {
  const [local, setLocal] = useState(value?.toString() ?? '');
  const commit = () => {
    const trimmed = local.trim();
    onSave(trimmed === '' ? undefined : Number(trimmed));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.midGray }}>Order</span>
      <input
        type="number"
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur(); } }}
        placeholder="—"
        style={{ width: 60, padding: '5px 8px', borderRadius: 8, border: `1px solid ${T.sand}`, background: T.cream, fontSize: 13, textAlign: 'center', fontFamily: 'inherit', color: T.charcoal, outline: 'none' }}
      />
    </div>
  );
};

// ─── List view ────────────────────────────────────────────────────────────────
const ItemRow = ({ item, onEdit, onDelete, onOrderChange }: any) => (
  <div
    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: T.warmWhite, border: `1px solid ${T.sand}`, borderRadius: 14, transition: 'border-color 0.15s' }}
    onMouseOver={e => (e.currentTarget.style.borderColor = T.sageMid)}
    onMouseOut={e => (e.currentTarget.style.borderColor = T.sand)}
  >
    <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: T.sand }}>
      <SafeImage src={item.imageUrl || FALLBACK_IMG} alt="" fill />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.charcoal, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.title || item.name || item.english_name}
      </div>
      {item.sanskrit_name && <div style={{ fontSize: 12, fontStyle: 'italic', color: T.terracottaLight }}>{item.sanskrit_name}</div>}
      {(() => {
        if (item.english_name) {
          const parts = [item.shortDescription].filter(Boolean);
          return parts.length > 0 ? (
            <div style={{ fontSize: 12, color: T.midGray, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {parts.join(' · ')}
            </div>
          ) : null;
        }
        const raw = item.description || item.detailedContent || '';
        const text = raw.replace(/<[^>]*>/g, '').trim();
        return text ? (
          <div style={{ fontSize: 12, color: T.midGray, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        ) : null;
      })()}
    </div>
    <OrderInput value={item.order} onSave={v => onOrderChange?.(item.id, v)} />
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      <button onClick={() => onEdit(item)} style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${T.sand}`, background: T.cream, color: T.sage, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Edit size={14} />
      </button>
      <button onClick={() => onDelete(item.id)} style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${T.sand}`, background: T.cream, color: T.red, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

const ListView = ({ items, activeTab, loading, categories, onEdit, onDelete, onCreate, onOrderChange }: any) => {
  const label = (item: any) => item.title || item.name || item.english_name || '';
  const supportsGroups = ['postures', 'anatomy', 'philosophy'].includes(activeTab);
  const groups = supportsGroups
    ? groupAndSort(items, categories ?? [], label)
    : [{ category: '', items: [...items].sort((a: any, b: any) => {
        const ao = a.order != null ? Number(a.order) : Infinity;
        const bo = b.order != null ? Number(b.order) : Infinity;
        if (ao !== bo) return ao - bo;
        return label(a).localeCompare(label(b));
      }) }];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: T.charcoal, fontStyle: 'italic', marginBottom: 2 }}>
            {TABS.find((t: any) => t.id === activeTab)?.label}
          </h2>
          <p style={{ fontSize: 12, color: T.midGray }}>{items.length} entries</p>
        </div>
        <button onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 12, background: T.sage, color: '#fff', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> Add entry
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.midGray }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${T.sand}`, borderTopColor: T.sage, borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.8s linear infinite' }} />
          Loading…
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: T.warmWhite, borderRadius: 16, border: `1px dashed ${T.sandDark}` }}>
          <p style={{ color: T.midGray, fontSize: 14 }}>No entries yet. Add the first one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: supportsGroups ? 28 : 10 }}>
          {groups.map((group: any) => (
            <div key={group.category || '__flat'}>
              {supportsGroups && group.category && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: 'italic', color: T.sage }}>{group.category}</span>
                  <span style={{ fontSize: 11, color: T.midGray, background: T.sand, borderRadius: 20, padding: '1px 8px' }}>{group.items.length}</span>
                  <div style={{ flex: 1, height: 1, background: T.sand }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.items.map((item: any) => (
                  <ItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onOrderChange={onOrderChange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

// ─── Sub-cards editor ─────────────────────────────────────────────────────────
const SubCardsEditor = ({ formData, setFormData }: { formData: any; setFormData: (d: any) => void }) => {
  const cards: any[] = formData.subCards || [];

  const update = (i: number, field: string, value: string) => {
    const next = cards.map((c, idx) => idx === i ? { ...c, [field]: value } : c);
    setFormData({ ...formData, subCards: next });
  };

  const add = () => {
    setFormData({ ...formData, subCards: [...cards, { title: '', description: '', imageUrl: '' }] });
  };

  const remove = (i: number) => {
    setFormData({ ...formData, subCards: cards.filter((_, idx) => idx !== i) });
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 18, background: T.sage, borderRadius: 2 }} />
          <label style={{ ...labelStyle, margin: 0 }}>Sub-cards ({cards.length})</label>
        </div>
        <button
          type="button"
          onClick={add}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.sage, background: T.sagePale, border: `1px solid ${T.sageMid}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Plus size={13} /> Add card
        </button>
      </div>
      <p style={{ fontSize: 11, color: T.midGray, marginBottom: 16 }}>
        Use sub-cards to list individual items within a topic — e.g. the 7 Mudras, each with a name, description, and optional image.
      </p>

      {cards.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', background: T.cream, border: `1px dashed ${T.sandDark}`, borderRadius: 12, color: T.midGray, fontSize: 13 }}>
          No sub-cards yet — click "Add card" to create the first one.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map((card, i) => (
          <div key={i} style={{ background: T.cream, border: `1px solid ${T.sand}`, borderRadius: 12, padding: 16, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: T.midGray, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Card {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                style={{ background: T.redPale, color: T.red, border: 'none', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={card.title || ''}
                  onChange={e => update(i, 'title', e.target.value)}
                  placeholder="e.g. Gyan Mudra"
                />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={3}
                  style={inputStyle}
                  value={card.description || ''}
                  onChange={e => update(i, 'description', e.target.value)}
                  placeholder="Brief description shown under the title…"
                />
              </div>
              <div>
                <label style={labelStyle}>Image URL (optional)</label>
                <input
                  style={inputStyle}
                  type="url"
                  value={card.imageUrl || ''}
                  onChange={e => update(i, 'imageUrl', normalizeImageUrl(e.target.value.trim()))}
                  placeholder="Paste any image URL…"
                />
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ─── Module items curator ─────────────────────────────────────────────────────
interface ModuleItemDraft { type: 'posture' | 'anatomy' | 'philosophy'; refId: string; teacherId?: string; }

const TYPE_COLORS: Record<string, { bg: string; color: string; activeBg: string }> = {
  posture:    { bg: '#f5e8e2', color: '#b85c38', activeBg: '#b85c38' },
  anatomy:    { bg: '#e8f0e6', color: '#4a6741', activeBg: '#4a6741' },
  philosophy: { bg: '#f0eefc', color: '#7a77cc', activeBg: '#7a77cc' },
};

const ModuleItemsEditor = ({ formData, setFormData, allItems }: {
  formData: any;
  setFormData: (d: any) => void;
  allItems: { postures: any[]; anatomy: any[]; philosophy: any[]; team: any[] };
}) => {
  const items: ModuleItemDraft[] = formData.items || [];
  const [pickerTab, setPickerTab] = React.useState<'posture' | 'anatomy' | 'philosophy'>('posture');

  const isSelected = (type: string, refId: string) =>
    items.some(i => i.type === type && i.refId === refId);

  const toggle = (type: 'posture' | 'anatomy' | 'philosophy', refId: string) => {
    if (isSelected(type, refId)) {
      setFormData({ ...formData, items: items.filter(i => !(i.type === type && i.refId === refId)) });
    } else {
      setFormData({ ...formData, items: [...items, { type, refId }] });
    }
  };

  const setTeacher = (i: number, teacherId: string) => {
    const next = items.map((item, idx) => idx === i ? { ...item, teacherId: teacherId || undefined } : item);
    setFormData({ ...formData, items: next });
  };

  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setFormData({ ...formData, items: next });
  };

  const getLabel = (item: ModuleItemDraft) => {
    const list = item.type === 'posture' ? allItems.postures : item.type === 'anatomy' ? allItems.anatomy : allItems.philosophy;
    const key  = item.type === 'posture' ? 'english_name' : 'title';
    return (list.find((x: any) => x.id === item.refId) || {})[key] || item.refId;
  };

  const pickerList = pickerTab === 'posture' ? allItems.postures
    : pickerTab === 'anatomy' ? allItems.anatomy
    : allItems.philosophy;
  const pickerLabelKey = pickerTab === 'posture' ? 'english_name' : 'title';

  const pickerTabs: Array<'posture' | 'anatomy' | 'philosophy'> = ['posture', 'anatomy', 'philosophy'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 3, height: 18, background: T.terracotta, borderRadius: 2 }} />
        <label style={{ ...labelStyle, margin: 0 }}>Module content</label>
        {items.length > 0 && (
          <span style={{ fontSize: 11, background: T.terracottaPale, color: T.terracotta, borderRadius: 20, padding: '2px 10px' }}>
            {items.length} selected
          </span>
        )}
      </div>
      <p style={{ fontSize: 11, color: T.midGray, marginBottom: 16 }}>
        Click any item to add it to the module. Click again to remove it.
      </p>

      {/* Two-column layout: picker left, selected right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* LEFT — picker */}
        <div style={{ border: `1px solid ${T.sand}`, borderRadius: 14, overflow: 'hidden' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', background: T.cream, borderBottom: `1px solid ${T.sand}` }}>
            {pickerTabs.map(tab => {
              const tc = TYPE_COLORS[tab];
              const active = pickerTab === tab;
              const count  = (tab === 'posture' ? allItems.postures : tab === 'anatomy' ? allItems.anatomy : allItems.philosophy).length;
              const selectedCount = items.filter(i => i.type === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPickerTab(tab)}
                  style={{
                    flex: 1, padding: '10px 4px', border: 'none', fontFamily: 'inherit',
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? tc.activeBg : 'transparent',
                    color: active ? '#fff' : T.midGray,
                    borderBottom: active ? 'none' : `2px solid transparent`,
                  }}
                >
                  {tab}{selectedCount > 0 && ` (${selectedCount})`}
                </button>
              );
            })}
          </div>
          {/* Scrollable list */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {pickerList.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: T.midGray, fontSize: 13 }}>
                No {pickerTab}s found.
              </div>
            ) : pickerList.map((x: any) => {
              const selected = isSelected(pickerTab, x.id);
              const tc = TYPE_COLORS[pickerTab];
              return (
                <div
                  key={x.id}
                  onClick={() => toggle(pickerTab, x.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', cursor: 'pointer',
                    background: selected ? tc.bg : 'transparent',
                    borderBottom: `1px solid ${T.lightGray}`,
                    transition: 'background 0.1s',
                  }}
                  onMouseOver={e => { if (!selected) e.currentTarget.style.background = T.cream; }}
                  onMouseOut={e  => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: `2px solid ${selected ? tc.color : T.sandDark}`,
                    background: selected ? tc.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selected && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                  </div>
                  {/* Thumbnail */}
                  {x.imageUrl && (
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: T.sand }}>
                      <img src={x.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  {/* Labels */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: selected ? tc.color : T.charcoal, fontWeight: selected ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {x[pickerLabelKey]}
                    </div>
                    {x.sanskrit_name && (
                      <div style={{ fontSize: 11, color: T.midGray, fontStyle: 'italic' }}>{x.sanskrit_name}</div>
                    )}
                    {x.category && (
                      <div style={{ fontSize: 10, color: T.midGray }}>{x.category}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — selected items with teacher assignment */}
        <div>
          {items.length === 0 ? (
            <div style={{ border: `1px dashed ${T.sandDark}`, borderRadius: 14, padding: 24, textAlign: 'center', color: T.midGray, fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>☰</div>
              Nothing selected yet. Click items on the left to add them.
            </div>
          ) : (
            <div style={{ border: `1px solid ${T.sand}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: T.cream, borderBottom: `1px solid ${T.sand}`, fontSize: 11, color: T.midGray, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Selected — drag to reorder
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {items.map((item, i) => {
                  const tc = TYPE_COLORS[item.type];
                  return (
                    <div key={i} style={{ padding: '10px 12px', borderBottom: `1px solid ${T.lightGray}`, background: T.warmWhite }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {/* Order arrows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
                          <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                            style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: T.midGray, padding: 0, fontSize: 9, lineHeight: 1, opacity: i === 0 ? 0.3 : 1 }}>▲</button>
                          <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                            style={{ background: 'none', border: 'none', cursor: i === items.length - 1 ? 'default' : 'pointer', color: T.midGray, padding: 0, fontSize: 9, lineHeight: 1, opacity: i === items.length - 1 ? 0.3 : 1 }}>▼</button>
                        </div>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: tc.bg, color: tc.color, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                          {item.type}
                        </span>
                        <span style={{ flex: 1, fontSize: 12, color: T.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getLabel(item)}
                        </span>
                        <button type="button" onClick={() => toggle(item.type, item.refId)}
                          style={{ background: T.redPale, color: T.red, border: 'none', borderRadius: 5, padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <X size={11} />
                        </button>
                      </div>
                      {/* Teacher selector */}
                      <select
                        value={item.teacherId || ''}
                        onChange={e => setTeacher(i, e.target.value)}
                        style={{ ...inputStyle, fontSize: 11, padding: '4px 8px', color: item.teacherId ? T.charcoal : T.midGray }}
                      >
                        <option value="">Assign a teacher (optional)</option>
                        {allItems.team.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const [activeTab,  setActiveTab]  = useState('postures');
  const [view,       setView]       = useState<'list' | 'form'>('list');
  const [formData,   setFormData]   = useState<any>({});
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [items,      setItems]      = useState<any[]>([]);
  const [msg,        setMsg]        = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [alignCues,  setAlignCues]  = useState<string[]>(['']);
  const [allCategories, setAllCategories] = useState<Record<CatType, Category[]>>({ postures: [], anatomy: [], philosophy: [] });
  const [allContent, setAllContent] = useState<{ postures: any[]; anatomy: any[]; philosophy: any[]; team: any[] }>({ postures: [], anatomy: [], philosophy: [], team: [] });

  const collection = TABS.find(t => t.id === activeTab)?.collection ?? '';

  const loadAllCategories = useCallback(async () => {
    try {
      const [pos, ana, phi] = await Promise.all([
        fetch('/api/admin/list?collection=posture_categories').then(r => r.json()),
        fetch('/api/admin/list?collection=anatomy_categories').then(r => r.json()),
        fetch('/api/admin/list?collection=philosophy_categories').then(r => r.json()),
      ]);
      const sort = (arr: any[]) => [...(arr ?? [])].sort((a, b) => a.name.localeCompare(b.name));
      setAllCategories({
        postures:   sort(pos.items),
        anatomy:    sort(ana.items),
        philosophy: sort(phi.items),
      });
    } catch (e) { console.error('Failed to load categories', e); }
  }, []);

  useEffect(() => { loadAllCategories(); }, [loadAllCategories]);

  // Load all content for the module items picker
  const loadAllContent = useCallback(async () => {
    try {
      const [pos, ana, phi, team] = await Promise.all([
        fetch('/api/admin/list?collection=postures').then(r => r.json()),
        fetch('/api/admin/list?collection=anatomy_topics').then(r => r.json()),
        fetch('/api/admin/list?collection=philosophy_topics').then(r => r.json()),
        fetch('/api/admin/list?collection=team_members').then(r => r.json()),
      ]);
      setAllContent({
        postures:   (pos.items  ?? []).sort((a: any, b: any) => (a.english_name || '').localeCompare(b.english_name || '')),
        anatomy:    (ana.items  ?? []).sort((a: any, b: any) => (a.title || '').localeCompare(b.title || '')),
        philosophy: (phi.items  ?? []).sort((a: any, b: any) => (a.title || '').localeCompare(b.title || '')),
        team:       (team.items ?? []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '')),
      });
    } catch (e) { console.error('Failed to load content for picker', e); }
  }, []);
  useEffect(() => { if (activeTab === 'modules') loadAllContent(); }, [activeTab, loadAllContent]);

  useEffect(() => {
    if (formData.alignment && Array.isArray(formData.alignment)) setAlignCues(formData.alignment);
    else setAlignCues(['']);
  }, [editingId]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/list?collection=${collection}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setItems(d.items || []);
    } catch (e: any) { showMsg('error', `Failed to load: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (view === 'list' && activeTab !== 'categories' && activeTab !== 'training') fetchItems(); }, [activeTab, view]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const url    = editingId ? '/api/admin/update' : '/api/admin/add';
      const method = editingId ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, data: formData, id: editingId }),
      });
      if (r.ok) { showMsg('success', editingId ? 'Entry updated' : 'Entry created'); setView('list'); }
      else showMsg('error', 'Save failed — check the server');
    } catch { showMsg('error', 'Network error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry permanently?')) return;
    setLoading(true);
    try {
      const r = await fetch('/api/admin/delete', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, id }),
      });
      if (r.ok) { showMsg('success', 'Deleted'); fetchItems(); }
    } catch { showMsg('error', 'Delete failed'); }
    finally { setLoading(false); }
  };

  const handleEdit   = (item: any) => { setFormData(item); setEditingId(item.id); setView('form'); };
  const handleCreate = ()           => { setFormData({});   setEditingId(null);    setAlignCues(['']); setView('form'); };

  const handleOrderChange = async (id: string, order: number | undefined) => {
    const item = items.find((i: any) => i.id === id);
    if (!item) return;
    try {
      const r = await fetch('/api/admin/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, data: { ...item, order }, id }),
      });
      if (r.ok) {
        setItems((prev: any[]) => prev.map(i => i.id === id ? { ...i, order } : i));
      } else {
        showMsg('error', 'Failed to save order');
      }
    } catch {
      showMsg('error', 'Failed to save order');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        textarea, input, select { font-family: inherit; }
      `}</style>

      {/* Top nav */}
      <div style={{ background: '#2c2c2a', padding: '0 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, height: 60 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={16} color="#fff" />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: '#fff' }}>YTB Admin</div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Teacher Training Control Panel</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

        {/* Toast */}
        {msg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: msg.type === 'success' ? T.greenPale : T.redPale, color: msg.type === 'success' ? T.green : T.red, border: `1px solid ${msg.type === 'success' ? '#86efac' : '#fca5a5'}`, fontSize: 14 }}>
            {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {msg.text}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: T.warmWhite, padding: 5, borderRadius: 14, border: `1px solid ${T.sand}` }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setView('list'); setFormData({}); setEditingId(null); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 0', borderRadius: 10, border: 'none', background: active ? T.charcoal : 'transparent', color: active ? '#fff' : T.midGray, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div style={{ background: T.warmWhite, borderRadius: 20, border: `1px solid ${T.sand}`, padding: '28px 32px' }}>
          {activeTab === 'training' ? (
            <TrainingSettingsPanel />
          ) : activeTab === 'categories' ? (
            <CategoriesTab allCategories={allCategories} onRefresh={loadAllCategories} />
          ) : view === 'list' ? (
            <ListView
              items={items}
              activeTab={activeTab}
              loading={loading}
              categories={
                activeTab === 'postures'   ? allCategories.postures   :
                activeTab === 'anatomy'    ? allCategories.anatomy    :
                activeTab === 'philosophy' ? allCategories.philosophy : []
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onOrderChange={handleOrderChange}
            />
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setView('list')} style={{ background: T.cream, border: `1px solid ${T.sand}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: T.midGray }}>
                    <ArrowLeft size={16} />
                  </button>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, color: T.charcoal, fontStyle: 'italic' }}>
                    {editingId ? 'Edit' : 'New'} {TABS.find(t => t.id === activeTab)?.label?.replace(/s$/, '')}
                  </h2>
                </div>
              </div>

              {activeTab === 'postures'   && <PosturesForm formData={formData} setFormData={setFormData} alignmentCues={alignCues} setAlignmentCues={setAlignCues} categories={allCategories.postures} />}
              {activeTab === 'anatomy'    && <SimpleForm formData={formData} setFormData={setFormData} fields={[{name:'title'},{name:'category',type:'select',label:'Category',options:allCategories.anatomy},{name:'order',type:'number',label:'Display order (optional — leave blank for alphabetical)'},{name:'description',type:'textarea',rows:2,label:'Short description (plain text, shown on card)'},{name:'imageUrl'},{name:'videoUrl',label:'Video URL'},{name:'detailedContent',rich:true,rows:12,label:'Detailed content'}]} />}
              {activeTab === 'anatomy'    && <SubCardsEditor formData={formData} setFormData={setFormData} />}
              {activeTab === 'philosophy' && <SimpleForm formData={formData} setFormData={setFormData} fields={[{name:'title'},{name:'category',type:'select',label:'Category',options:allCategories.philosophy},{name:'order',type:'number',label:'Display order (optional — leave blank for alphabetical)'},{name:'description',type:'textarea',rows:2,label:'Short description (plain text, shown on card)'},{name:'imageUrl'},{name:'videoUrl',label:'Video URL'},{name:'detailedContent',rich:true,rows:12,label:'Detailed content'}]} />}
              {activeTab === 'philosophy' && <SubCardsEditor formData={formData} setFormData={setFormData} />}
              {activeTab === 'team'       && <SimpleForm formData={formData} setFormData={setFormData} fields={[{name:'name',label:'Teacher name'},{name:'imageUrl'},{name:'videoUrl',label:'Intro video URL'},{name:'description',rich:true,rows:8,label:'Bio'}]} />}
              {activeTab === 'modules' && <>
                <SimpleForm formData={formData} setFormData={setFormData} fields={[
                  {name:'title',label:'Module title'},
                  {name:'section',label:'Section (e.g. "Week 1", "Voice & Cuing")'},
                  {name:'order',type:'number',label:'Display order (1, 2, 3…)'},
                  {name:'description',rich:true,rows:6,label:'Description (shown when opened)'},
                  {name:'videoUrl',label:'Video URL (YouTube / Vimeo)'},
                  {name:'tips',type:'textarea',rows:4,label:'Quick tips (one per line)'},
                ]} />
                <div style={{ marginTop: 24 }}>
                  <ModuleItemsEditor
                    formData={formData}
                    setFormData={setFormData}
                    allItems={allContent}
                  />
                </div>
              </>}

              <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.lightGray}` }}>
                <button onClick={handleSubmit} disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 12, border: 'none', background: saving ? T.sageMid : T.sage, color: '#fff', fontSize: 14, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  <Save size={16} />{saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish entry'}
                </button>
                <button onClick={() => setView('list')} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: `1px solid ${T.sand}`, background: 'transparent', color: T.midGray, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
