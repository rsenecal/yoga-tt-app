'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, X, BookOpen, Users, Heart, Dumbbell, Book, Edit, Trash2, Upload, FileImage, Play } from 'lucide-react';
import Image from 'next/image';

// --- CONSTANTS & FALLBACKS (OUTSIDE) ---
const FALLBACKS = {
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  anatomy: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  team: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80'
};

const TABS = [
  { id: 'postures', label: 'Postures', icon: Dumbbell, collection: 'postures' },
  { id: 'anatomy', label: 'Anatomy', icon: Heart, collection: 'anatomy_topics' },
  { id: 'philosophy', label: 'Philosophy', icon: Book, collection: 'philosophy_topics' },
  { id: 'team', label: 'Team', icon: Users, collection: 'team_members' },
];

// --- SUB-COMPONENTS (DEFINED OUTSIDE TO PREVENT CURSOR FOCUS LOSS) ---

const ImageUploadField = ({ formData, setFormData, handleImageUpload, uploadingImage }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-900 mb-2">Image Resource</label>
    <div className="space-y-3">
      {formData.imageUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-orange-100">
          <Image 
            src={formData.imageUrl} 
            alt="Preview" 
            fill 
            className="object-cover" 
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, imageUrl: '' })}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 z-10 shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Paste Image URL"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 text-gray-900 placeholder-gray-400 outline-none transition-colors"
        />
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
          <div className="px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-lg hover:bg-orange-200 flex items-center gap-2 border-2 border-orange-200 transition-all">
            {uploadingImage ? 'Uploading...' : <><Upload size={20} />Upload</>}
          </div>
        </label>
      </div>
    </div>
  </div>
);

const PosturesForm = ({ formData, setFormData, alignmentCues, setAlignmentCues, handleImageUpload, uploadingImage }: any) => {
  const updateAlignment = (index: number, value: string) => {
    const newList = [...alignmentCues];
    newList[index] = value;
    setAlignmentCues(newList);
    setFormData({ ...formData, alignment: newList });
  };

  const addAlignmentField = () => {
    const newList = [...alignmentCues, ''];
    setAlignmentCues(newList);
    setFormData({ ...formData, alignment: newList });
  };

  const removeAlignmentField = (index: number) => {
    const newList = alignmentCues.filter((_: any, i: number) => i !== index);
    setAlignmentCues(newList);
    setFormData({ ...formData, alignment: newList });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">English Name</label>
          <input type="text" value={formData.english_name || ''} onChange={(e) => setFormData({ ...formData, english_name: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">Sanskrit Name</label>
          <input type="text" value={formData.sanskrit_name || ''} onChange={(e) => setFormData({ ...formData, sanskrit_name: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
        <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none">
          <option value="">Select category</option>
          <option>Standing</option><option>Inversion</option><option>Resting</option><option>Seated</option><option>Backbend</option><option>Forward Fold</option>
        </select>
      </div>

      <ImageUploadField formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1 flex items-center gap-2"><Play size={16} /> Video URL (YouTube/Vimeo)</label>
        <input type="url" placeholder="Paste full video link" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-900">Alignment Cues</label>
        <div className="space-y-2">
          {alignmentCues.map((cue: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={cue} onChange={(e) => updateAlignment(i, e.target.value)} className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
              {alignmentCues.length > 1 && (
                <button type="button" onClick={() => removeAlignmentField(i)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X size={20} /></button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addAlignmentField} className="mt-2 text-orange-700 text-sm flex items-center gap-1 font-bold hover:text-orange-900"><Plus size={16} />Add cue</button>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">Teaching Dialogue</label>
        <textarea rows={3} value={formData.dialogue || ''} onChange={(e) => setFormData({ ...formData, dialogue: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">Benefits</label>
          <textarea rows={2} value={formData.benefits || ''} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">Key Muscles</label>
          <textarea rows={2} value={formData.key_muscles || ''} onChange={(e) => setFormData({ ...formData, key_muscles: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
        </div>
      </div>
    </div>
  );
};

const SimpleForm = ({ fields, formData, setFormData, handleImageUpload, uploadingImage }: any) => (
  <div className="space-y-6">
    {fields.map((f: any) => (
      <div key={f.name}>
        {f.name === 'imageUrl' ? (
          <ImageUploadField formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />
        ) : (
          <>
            <label className="block text-sm font-bold text-gray-900 mb-1">{f.label || f.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str: any) => str.toUpperCase())}</label>
            {f.type === 'textarea' ? (
              <textarea rows={f.rows || 4} value={formData[f.name] || ''} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
            ) : (
              <input type={f.type || 'text'} value={formData[f.name] || ''} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 outline-none focus:border-orange-500" />
            )}
          </>
        )}
      </div>
    ))}
  </div>
);

const ListView = ({ items, activeTab, loading, handleEdit, handleDelete, setView, setFormData, setEditingId }: any) => (
  <div className="mt-4">
    <div className="flex justify-between items-center mb-8 bg-orange-50 p-4 rounded-xl border border-orange-100">
      <h2 className="text-xl font-black text-orange-950 uppercase tracking-tight">{TABS.find(t => t.id === activeTab)?.label} Library <span className="text-orange-600 ml-2">({items.length})</span></h2>
      <button onClick={() => { setFormData({}); setEditingId(null); setView('form'); }} className="bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-lg transition-transform active:scale-95 font-bold">
        <Plus size={20} />Add Entry
      </button>
    </div>

    {loading ? (
      <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div><p className="mt-4 text-orange-900 font-bold">Fetching data...</p></div>
    ) : items.length === 0 ? (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <FileImage size={64} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-900 font-bold text-lg">No content found in this section yet.</p>
      </div>
    ) : (
      <div className="grid gap-6">
        {items.map((item: any) => (
          <div key={item.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-xl transition-all group">
            <div className="flex gap-6 items-center">
              <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-gray-50 shadow-inner">
                <Image src={item.imageUrl || FALLBACKS.yoga} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-gray-900 mb-1">{item.title || item.name || item.english_name}</h3>
                {item.sanskrit_name && <p className="text-orange-600 font-bold italic text-sm mb-2">{item.sanskrit_name}</p>}
                <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{item.description || item.detailedContent}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(item)} className="p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-colors"><Edit size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- MAIN ADMIN PANEL COMPONENT ---

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('postures');
  const [view, setView] = useState('list');
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alignmentCues, setAlignmentCues] = useState<string[]>(['']);

  useEffect(() => {
    if (formData.alignment && Array.isArray(formData.alignment)) {
      setAlignmentCues(formData.alignment);
    } else {
      setAlignmentCues(['']);
    }
  }, [editingId, formData.alignment]);

  const currentCollection = TABS.find(t => t.id === activeTab)?.collection;

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/list?collection=${currentCollection}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) { showMessage('error', 'Network error while fetching items'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (view === 'list') fetchItems(); }, [activeTab, view]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showMessage('error', 'Image size must be under 5MB');
    
    setUploadingImage(true);
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, imageUrl: data.url });
        showMessage('success', 'Image successfully uploaded and linked');
      }
    } catch (error) { showMessage('error', 'Upload failed. Check server status'); } 
    finally { setUploadingImage(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = editingId ? `/api/admin/update` : `/api/admin/add`;
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: currentCollection, data: formData, id: editingId })
      });
      if (response.ok) {
        showMessage('success', editingId ? 'Entry updated successfully' : 'New entry created');
        setView('list');
      }
    } catch (error) { showMessage('error', 'Save operation failed'); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Warning: Are you sure you want to permanently delete this item?')) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: currentCollection, id })
      });
      if (response.ok) { showMessage('success', 'Entry removed'); fetchItems(); }
    } catch (error) { showMessage('error', 'Delete operation failed'); } 
    finally { setLoading(false); }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-white">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg"><BookOpen size={40} className="text-white" /></div>
            <div>
              <h1 className="text-4xl font-black text-orange-950 tracking-tight">Teacher Training Admin</h1>
              <p className="text-orange-800 font-medium">Control Center for Yoga Tribe Brooklyn Manual</p>
            </div>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-xl font-bold border-2 animate-bounce ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-4 mb-10 border-b-2 border-gray-100 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => { setActiveTab(tab.id); setView('list'); setFormData({}); setEditingId(null); }} 
                  className={`flex items-center gap-2 px-6 py-4 font-black whitespace-nowrap transition-all border-b-4 ${activeTab === tab.id ? 'text-orange-600 border-orange-600' : 'text-gray-400 border-transparent hover:text-orange-400'}`}
                >
                  <Icon size={20} />{tab.label}
                </button>
              );
            })}
          </div>

          {view === 'list' ? (
            <ListView items={items} activeTab={activeTab} loading={loading} handleEdit={handleEdit} handleDelete={handleDelete} setView={setView} setFormData={setFormData} setEditingId={setEditingId} />
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900 uppercase">{editingId ? 'Modify' : 'Create New'} {TABS.find(t => t.id === activeTab)?.label}</h2>
                <button onClick={() => setView('list')} className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
              </div>

              {activeTab === 'postures' && <PosturesForm formData={formData} setFormData={setFormData} alignmentCues={alignmentCues} setAlignmentCues={setAlignmentCues} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />}
              {activeTab === 'anatomy' && <SimpleForm formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} fields={[{ name: 'title' }, { name: 'description', type: 'textarea', rows: 2 }, { name: 'imageUrl' }, { name: 'videoUrl', label: 'Instructional Video URL' }, { name: 'detailedContent', type: 'textarea', rows: 8 }]} />}
              {activeTab === 'philosophy' && <SimpleForm formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} fields={[{ name: 'title' }, { name: 'description', type: 'textarea', rows: 2 }, { name: 'imageUrl' }, { name: 'videoUrl', label: 'Resource Video URL' }, { name: 'detailedContent', type: 'textarea', rows: 8 }]} />}
              {activeTab === 'team' && <SimpleForm formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} fields={[{ name: 'name', label: 'Teacher Full Name' }, { name: 'imageUrl' }, { name: 'videoUrl', label: 'Intro Video URL' }, { name: 'description', type: 'textarea', rows: 6 }]} />}

              <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t-2 border-gray-50">
                <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-orange-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-700 shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                  <Save size={24} />{loading ? 'Processing...' : editingId ? 'Apply Changes' : 'Publish Entry'}
                </button>
                <button onClick={() => setView('list')} className="flex-1 px-8 py-5 border-3 border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm">Discard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}