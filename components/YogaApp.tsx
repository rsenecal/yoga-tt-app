'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Bookmark, BookmarkCheck, Menu, X, Home, Users, Heart, Book, Compass, Flower2, Play } from 'lucide-react';
import { getAnatomyTopics, getPhilosophyTopics, getPostures, getTeamMembers } from '@/lib/fetchData';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

// --- CONSTANTS & INTERFACES ---
const categories = ["All", "Standing", "Inversion", "Resting", "Seated", "Backbend", "Forward Fold"];

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'anatomy', label: 'Anatomy', icon: Heart },
  { id: 'philosophy', label: 'Yoga Philosophy', icon: Book },
  { id: 'teaching', label: 'Teaching Guidelines', icon: Compass },
  { id: 'postures', label: 'Postures', icon: Flower2 }
];

const FALLBACKS = {
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  anatomy: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  team: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80'
};

interface AnatomyCard { id: string; title: string; description: string; imageUrl: string; detailedContent: string; videoUrl?: string; }
interface PhilosophyCard { id: string; title: string; description: string; imageUrl: string; detailedContent: string; videoUrl?: string; }
interface Posture { id: string; english_name: string; sanskrit_name: string; category: string; description: string; imageUrl: string; alignment: string[]; dialogue: string; benefits: string; key_muscles: string; videoUrl?: string; }
interface TeamMember { id: string; name: string; imageUrl: string; description: string; }

// --- HELPER COMPONENTS ---

const VideoPlayer = ({ url }: { url?: string }) => {
  if (!url) return null;
  let embedUrl = '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }
  if (!embedUrl) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-orange-900 mb-3 font-semibold">
        <Play size={18} fill="currentColor" />
        <span>Video Demonstration</span>
      </div>
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
      </div>
    </div>
  );
};

const Header = ({ navigateTo, currentPage, showMobileMenu, setShowMobileMenu }: any) => (
  <header className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
    <div onClick={() => navigateTo('home')} className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Flower2 className="text-orange-500" />
      <span className="font-bold text-orange-900">YTB Manual</span>
    </div>
    <nav className="hidden md:flex gap-4">
      {navItems.map(n => (
        <button 
          key={n.id} 
          onClick={() => navigateTo(n.id)} 
          className={`text-sm px-3 py-1 rounded-lg transition-colors ${currentPage === n.id ? 'bg-orange-500 text-white font-bold' : 'text-gray-600 hover:bg-orange-50'}`}
        >
          {n.label}
        </button>
      ))}
    </nav>
    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-600 hover:text-orange-500">
      {showMobileMenu ? <X /> : <Menu />}
    </button>
    {showMobileMenu && (
      <nav className="absolute top-full left-0 right-0 md:hidden border-t bg-white px-4 py-2 space-y-1 shadow-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id} 
              onClick={() => navigateTo(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${currentPage === item.id ? 'bg-orange-500 text-white' : 'hover:bg-orange-50 text-gray-700'}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    )}
  </header>
);

const LandingPage = ({ navigateTo }: any) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
    <div className="max-w-6xl w-full text-center">
      <Flower2 size={64} className="text-orange-500 mx-auto mb-6" />
      <h1 className="text-5xl font-bold text-orange-900 mb-4">YTB Teacher Training</h1>
      <p className="text-xl text-orange-600 mb-12 italic">300-Hour Yoga Teacher Training Manual</p>
      <div className="grid md:grid-cols-3 gap-6">
        {navItems.slice(1).map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => navigateTo(item.id)} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all group">
              <Icon size={40} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900">{item.label}</h3>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const TeamPage = ({ teamMembers, navigateTo }: any) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-12">
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-orange-600 mb-8 font-medium hover:text-orange-700 transition-colors"><Home size={16} />Back to Home</button>
      <div className="mb-12"><h1 className="text-4xl font-bold text-orange-900 mb-4">Meet Your Teachers</h1><p className="text-gray-700 text-lg">Our dedicated instructors will guide you through your journey.</p></div>
      <div className="grid md:grid-cols-2 gap-8">
        {teamMembers.map((member: any) => (
          <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow">
            <div className="relative w-full md:w-48 h-64 md:h-auto shrink-0">
              <Image src={member.imageUrl || FALLBACKS.team} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 192px" />
            </div>
            <div className="p-6 flex-1"><h3 className="text-2xl font-bold text-orange-900 mb-3">{member.name}</h3><p className="text-gray-700 leading-relaxed">{member.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnatomyPage = ({ anatomyCards, selectedAnatomyCard, setSelectedAnatomyCard, navigateTo, anatomyPage, setAnatomyPage, totalAnatomyPages, paginatedAnatomyCards }: any) => {
  if (selectedAnatomyCard) return (
    <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto">
      <button onClick={() => setSelectedAnatomyCard(null)} className="text-orange-600 mb-8 font-medium">← Back to Anatomy</button>
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
        <Image src={selectedAnatomyCard.imageUrl || FALLBACKS.anatomy} alt={selectedAnatomyCard.title} fill className="object-cover" priority />
      </div>
      <h1 className="text-4xl font-bold text-orange-900 mb-6">{selectedAnatomyCard.title}</h1>
      <VideoPlayer url={selectedAnatomyCard.videoUrl} />
      <div className="prose prose-orange max-w-none"><p className="text-gray-700 text-lg whitespace-pre-wrap">{selectedAnatomyCard.detailedContent}</p></div>
    </div>
  );
  return (
    <div className="p-12 max-w-7xl mx-auto">
      <button onClick={() => navigateTo('home')} className="text-orange-600 mb-8 font-medium">Back to Home</button>
      <h1 className="text-4xl font-bold text-orange-900 mb-8">Anatomy</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {paginatedAnatomyCards.map((card: any) => (
          <div key={card.id} onClick={() => setSelectedAnatomyCard(card)} className="bg-white rounded-xl shadow hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
            <div className="relative w-full h-48"><Image src={card.imageUrl || FALLBACKS.anatomy} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div>
            <div className="p-6"><h3 className="font-bold text-orange-900">{card.title}</h3><p className="text-gray-600 text-sm mt-2">{card.description}</p></div>
          </div>
        ))}
      </div>
      {totalAnatomyPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setAnatomyPage((p: any) => Math.max(1, p - 1))} disabled={anatomyPage === 1} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Previous</button>
          {Array.from({ length: totalAnatomyPages }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => setAnatomyPage(num)} className={`w-10 h-10 rounded-lg ${anatomyPage === num ? 'bg-orange-500 text-white' : 'bg-white shadow'}`}>{num}</button>
          ))}
          <button onClick={() => setAnatomyPage((p: any) => Math.min(totalAnatomyPages, p + 1))} disabled={anatomyPage === totalAnatomyPages} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

const PhilosophyPage = ({ philosophyCards, selectedPhilosophyCard, setSelectedPhilosophyCard, navigateTo, philosophyPage, setPhilosophyPage, totalPhilosophyPages, paginatedPhilosophyCards }: any) => {
  if (selectedPhilosophyCard) return (
    <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto">
      <button onClick={() => setSelectedPhilosophyCard(null)} className="text-orange-600 mb-8">← Back</button>
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
        <Image src={selectedPhilosophyCard.imageUrl || FALLBACKS.yoga} alt={selectedPhilosophyCard.title} fill className="object-cover" />
      </div>
      <h1 className="text-4xl font-bold text-orange-900 mb-6">{selectedPhilosophyCard.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{selectedPhilosophyCard.detailedContent}</p>
    </div>
  );
  return (
    <div className="p-12 max-w-7xl mx-auto">
      <button onClick={() => navigateTo('home')} className="text-orange-600 mb-8">Back to Home</button>
      <h1 className="text-4xl font-bold text-orange-900 mb-8">Yoga Philosophy</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {paginatedPhilosophyCards.map((card: any) => (
          <div key={card.id} onClick={() => setSelectedPhilosophyCard(card)} className="bg-white rounded-xl shadow group overflow-hidden cursor-pointer">
            <div className="relative w-full h-48"><Image src={card.imageUrl || FALLBACKS.yoga} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div>
            <div className="p-6"><h3 className="font-bold text-gray-700">{card.title}</h3><p className="text-sm text-gray-600">{card.description}</p></div>
          </div>
        ))}
      </div>
      {totalPhilosophyPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setPhilosophyPage((p: any) => Math.max(1, p - 1))} disabled={philosophyPage === 1} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Previous</button>
          {Array.from({ length: totalPhilosophyPages }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => setPhilosophyPage(num)} className={`w-10 h-10 rounded-lg ${philosophyPage === num ? 'bg-orange-500 text-white' : 'bg-white shadow'}`}>{num}</button>
          ))}
          <button onClick={() => setPhilosophyPage((p: any) => Math.min(totalPhilosophyPages, p + 1))} disabled={philosophyPage === totalPhilosophyPages} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

const PosturesPage = ({ postures, selectedPosture, setSelectedPosture, navigateTo, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, bookmarked, toggleBookmark, posturePage, setPosturePage, totalPosturePages, paginatedPostures }: any) => {
  if (selectedPosture) return (
    <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto">
      <button onClick={() => setSelectedPosture(null)} className="text-orange-600 mb-8 font-medium">← Back to Postures</button>
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
        <Image src={selectedPosture.imageUrl || FALLBACKS.yoga} alt={selectedPosture.english_name} fill className="object-cover" />
      </div>
      <h1 className="text-4xl font-bold text-orange-900">{selectedPosture.english_name}</h1>
      <p className="text-xl italic text-orange-600 mb-8">{selectedPosture.sanskrit_name}</p>
      <VideoPlayer url={selectedPosture.videoUrl} />
      <div className="space-y-6">
        <div><h3 className="font-bold text-lg text-gray-700">Alignment</h3><ul className="list-disc pl-5 text-gray-500">{selectedPosture.alignment.map((a:any,i:any)=><li key={i}>{a}</li>)}</ul></div>
        <div className="bg-orange-50 p-6 rounded-lg italic text-gray-600">"{selectedPosture.dialogue}"</div>
        <div><h3 className="font-bold text-lg text-gray-700">Benefits</h3><p className="text-gray-500">{selectedPosture.benefits}</p></div>
        <div><h3 className="font-bold text-lg text-gray-700">Key Muscles</h3><p className="text-gray-500">{selectedPosture.key_muscles}</p></div>
      </div>
    </div>
  );
  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-900">Postures</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
          />
        </div>
      </div>
      <div className="grid md:grid-cols-12 gap-8">
        <aside className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 text-orange-900">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setSelectedCategory(cat); setPosturePage(1); }} 
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'hover:bg-orange-50 text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t font-medium text-gray-700 flex items-center gap-2 px-4 py-2">
              <Bookmark size={18} />Bookmarked ({bookmarked.size})
            </div>
          </div>
        </aside>
        <main className="md:col-span-9">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedPostures.map((p: any) => (
              <div key={p.id} onClick={() => setSelectedPosture(p)} className="bg-white rounded-xl shadow cursor-pointer group overflow-hidden">
                <div className="relative w-full h-48"><Image src={p.imageUrl || FALLBACKS.yoga} alt={p.english_name} fill className="object-cover group-hover:scale-105 transition-transform" /></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-orange-900">{p.english_name}</h3>
                      <p className="text-sm text-orange-600">{p.sanskrit_name}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(p.id); }} 
                      className="p-2 hover:bg-orange-50 rounded-lg"
                    >
                      {bookmarked.has(p.id) ? <BookmarkCheck size={20} className="text-orange-600" /> : <Bookmark size={20} className="text-gray-400" />}
                    </button>
                  </div>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs mb-3">{p.category}</span>
                </div>
              </div>
            ))}
          </div>
          {totalPosturePages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button onClick={() => setPosturePage((p: any) => Math.max(1, p - 1))} disabled={posturePage === 1} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPosturePages }, (_, i) => i + 1).map(num => (
                <button key={num} onClick={() => setPosturePage(num)} className={`w-10 h-10 rounded-lg ${posturePage === num ? 'bg-orange-500 text-white' : 'bg-white shadow'}`}>{num}</button>
              ))}
              <button onClick={() => setPosturePage((p: any) => Math.min(totalPosturePages, p + 1))} disabled={posturePage === totalPosturePages} className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50">Next</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function YogaApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarked, setBookmarked] = useState(new Set<string>());
  const [selectedPosture, setSelectedPosture] = useState<Posture | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedAnatomyCard, setSelectedAnatomyCard] = useState<AnatomyCard | null>(null);
  const [anatomyPage, setAnatomyPage] = useState(1);
  const [posturePage, setPosturePage] = useState(1);
  const [selectedPhilosophyCard, setSelectedPhilosophyCard] = useState<PhilosophyCard | null>(null);
  const [philosophyPage, setPhilosophyPage] = useState(1);
  
  const [anatomyCards, setAnatomyCards] = useState<AnatomyCard[]>([]);
  const [philosophyCards, setPhilosophyCards] = useState<PhilosophyCard[]>([]);
  const [postures, setPostures] = useState<Posture[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [anatomy, philosophy, posturesData, team] = await Promise.all([
          getAnatomyTopics(), getPhilosophyTopics(), getPostures(), getTeamMembers()
        ]);
        setAnatomyCards(anatomy as AnatomyCard[]);
        setPhilosophyCards(philosophy as PhilosophyCard[]);
        setPostures(posturesData as Posture[]);
        setTeamMembers(team as TeamMember[]);
      } catch (error) { console.error('❌ Error loading data:', error); } finally { setLoading(false); }
    }
    loadData();
  }, []);

  const itemsPerPage = 6;
  const totalAnatomyPages = Math.ceil(anatomyCards.length / itemsPerPage);
  const paginatedAnatomyCards = anatomyCards.slice((anatomyPage - 1) * itemsPerPage, anatomyPage * itemsPerPage);

  const totalPhilosophyPages = Math.ceil(philosophyCards.length / itemsPerPage);
  const paginatedPhilosophyCards = philosophyCards.slice((philosophyPage - 1) * itemsPerPage, philosophyPage * itemsPerPage);

  const posturesPerPage = 9;
  const filteredPostures = useMemo(() => {
    return postures.filter(p => (p.english_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sanskrit_name.toLowerCase().includes(searchTerm.toLowerCase())) && (selectedCategory === 'All' || p.category === selectedCategory));
  }, [searchTerm, selectedCategory, postures]);

  const totalPosturePages = Math.ceil(filteredPostures.length / posturesPerPage);
  const paginatedPostures = filteredPostures.slice((posturePage - 1) * posturesPerPage, posturePage * posturesPerPage);

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setBookmarked(next);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page); setShowMobileMenu(false); setSelectedPosture(null); setSelectedAnatomyCard(null); setSelectedPhilosophyCard(null);
    setAnatomyPage(1); setPhilosophyPage(1); setPosturePage(1); setSearchTerm(''); setSelectedCategory('All');
  };

  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center text-orange-900 animate-pulse">
      <Flower2 size={64} className="mr-4"/> Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {currentPage !== 'home' && (
        <Header 
          navigateTo={navigateTo} 
          currentPage={currentPage} 
          showMobileMenu={showMobileMenu} 
          setShowMobileMenu={setShowMobileMenu} 
        />
      )}
      
      {currentPage === 'home' && <LandingPage navigateTo={navigateTo} />}
      {currentPage === 'team' && <TeamPage teamMembers={teamMembers} navigateTo={navigateTo} />}
      
      {currentPage === 'anatomy' && (
        <AnatomyPage 
          anatomyCards={anatomyCards}
          selectedAnatomyCard={selectedAnatomyCard}
          setSelectedAnatomyCard={setSelectedAnatomyCard}
          navigateTo={navigateTo}
          anatomyPage={anatomyPage}
          setAnatomyPage={setAnatomyPage}
          totalAnatomyPages={totalAnatomyPages}
          paginatedAnatomyCards={paginatedAnatomyCards}
        />
      )}

      {currentPage === 'philosophy' && (
        <PhilosophyPage 
          philosophyCards={philosophyCards}
          selectedPhilosophyCard={selectedPhilosophyCard}
          setSelectedPhilosophyCard={setSelectedPhilosophyCard}
          navigateTo={navigateTo}
          philosophyPage={philosophyPage}
          setPhilosophyPage={setPhilosophyPage}
          totalPhilosophyPages={totalPhilosophyPages}
          paginatedPhilosophyCards={paginatedPhilosophyCards}
        />
      )}

      {currentPage === 'teaching' && (
        <div className="p-12 max-w-4xl mx-auto text-center">
          <Compass size={64} className="text-orange-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-orange-900 mb-6">Teaching Guidelines</h1>
          <p className="text-gray-700 text-lg mb-8">Master the art of effective yoga instruction.</p>
          <button onClick={() => navigateTo('home')} className="bg-orange-500 text-white px-6 py-2 rounded-lg">Back to Home</button>
        </div>
      )}

      {currentPage === 'postures' && (
        <PosturesPage 
          postures={postures}
          selectedPosture={selectedPosture}
          setSelectedPosture={setSelectedPosture}
          navigateTo={navigateTo}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          bookmarked={bookmarked}
          toggleBookmark={toggleBookmark}
          posturePage={posturePage}
          setPosturePage={setPosturePage}
          totalPosturePages={totalPosturePages}
          paginatedPostures={paginatedPostures}
        />
      )}
    </div>
  );
}