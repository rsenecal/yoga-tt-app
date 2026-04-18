'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { getAnatomyTopics, getPhilosophyTopics, getPostures, getTeamMembers } from '@/lib/fetchData';
import { POSTURES_PER_PAGE } from '@/lib/constants';
import type { AnatomyCard, PhilosophyCard, Posture, TeamMember, Module, CategoryItem, TrainingInfo } from '@/lib/types';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { LoadingSplash } from '@/components/layout/LoadingSplash';
import { HomePage } from '@/components/pages/HomePage';
import { TeamPage } from '@/components/pages/TeamPage';
import { AnatomyPage } from '@/components/pages/AnatomyPage';
import { PhilosophyPage } from '@/components/pages/PhilosophyPage';
import { ModulesPage } from '@/components/pages/ModulesPage';
import { PosturesPage } from '@/components/pages/PosturesPage';

// ─── Device ID ────────────────────────────────────────────────────────────────

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('ytb_device_id');
  if (!id) {
    id = 'device_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ytb_device_id', id);
  }
  return id;
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function YogaApp() {
  const [page,             setCurrentPage]    = useState('home');
  const [mobileOpen,       setMobileOpen]     = useState(false);

  // Content
  const [anatomyCards,     setAnatomyCards]   = useState<AnatomyCard[]>([]);
  const [philosophyCards,  setPhilosophyCards] = useState<PhilosophyCard[]>([]);
  const [postures,         setPostures]       = useState<Posture[]>([]);
  const [teamMembers,      setTeamMembers]    = useState<TeamMember[]>([]);
  const [modules,          setModules]        = useState<Module[]>([]);
  const [trainingInfo,     setTrainingInfo]   = useState<TrainingInfo | null>(null);
  const [postureCategories, setPostureCategories] = useState<CategoryItem[]>([]);
  const [anatomyCategories, setAnatomyCategories] = useState<CategoryItem[]>([]);
  const [philosophyCategories, setPhilosophyCategories] = useState<CategoryItem[]>([]);
  const [loading,          setLoading]        = useState(true);

  // Progress
  const [completedIds,     setCompletedIds]   = useState<Set<string>>(new Set());
  const [loadingProgress,  setLoadingProgress] = useState(false);

  // Posture state
  const [selectedPosture,  setSelectedPosture] = useState<Posture | null>(null);
  const [searchTerm,       setSearchTerm]     = useState('');
  const [category,         setCategory]       = useState('All');
  const [bookmarked,       setBookmarked]     = useState(new Set<string>());
  const [posturePage,      setPosturePage]    = useState(1);

  // Anatomy state
  const [selectedAnatomy,  setSelectedAnatomy] = useState<AnatomyCard | null>(null);

  // Philosophy state
  const [selectedPhil,     setSelectedPhil]  = useState<PhilosophyCard | null>(null);

  // Safe fetch helper — returns null on non-JSON responses
  const safeFetch = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      console.error(`Non-JSON response from ${url} (${res.status}):`, await res.text());
      return null;
    }
    return res.json();
  };

  // Load all content + modules
  useEffect(() => {
    (async () => {
      try {
        const [an, ph, po, tm, modRes, posCats, anCats, phiCats, trainRes] = await Promise.all([
          getAnatomyTopics(), getPhilosophyTopics(), getPostures(), getTeamMembers(),
          safeFetch('/api/admin/list?collection=modules'),
          safeFetch('/api/admin/list?collection=posture_categories'),
          safeFetch('/api/admin/list?collection=anatomy_categories'),
          safeFetch('/api/admin/list?collection=philosophy_categories'),
          safeFetch('/api/admin/list?collection=training_info'),
        ]);
        setAnatomyCards(an as AnatomyCard[]);
        setPhilosophyCards(ph as PhilosophyCard[]);
        setPostures(po as Posture[]);
        setTeamMembers(tm as TeamMember[]);
        setModules(((modRes?.items) ?? []) as Module[]);
        setPostureCategories(((posCats?.items) ?? []) as CategoryItem[]);
        setAnatomyCategories(((anCats?.items) ?? []) as CategoryItem[]);
        setPhilosophyCategories(((phiCats?.items) ?? []) as CategoryItem[]);
        const trainItems = (trainRes?.items ?? []) as TrainingInfo[];
        if (trainItems.length > 0) setTrainingInfo(trainItems[0]);
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load progress
  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return;
    (async () => {
      try {
        const data = await safeFetch(`/api/progress?sessionId=${deviceId}`);
        setCompletedIds(new Set(data?.completedModules ?? []));
      } catch (err) {
        console.error('Progress load error:', err);
      }
    })();
  }, []);

  // Toggle a module complete/incomplete and persist
  const toggleModule = useCallback(async (moduleId: string, completed: boolean) => {
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return;

    setCompletedIds(prev => {
      const next = new Set(prev);
      completed ? next.add(moduleId) : next.delete(moduleId);
      return next;
    });

    setLoadingProgress(true);
    try {
      await safeFetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: deviceId, moduleId, completed }),
      });
    } catch (err) {
      console.error('Progress save error:', err);
      setCompletedIds(prev => {
        const next = new Set(prev);
        completed ? next.delete(moduleId) : next.add(moduleId);
        return next;
      });
    } finally {
      setLoadingProgress(false);
    }
  }, []);

  const navigateTo = useCallback((p: string) => {
    setCurrentPage(p);
    setMobileOpen(false);
    setSelectedPosture(null);
    setSelectedAnatomy(null);
    setSelectedPhil(null);
    setPosturePage(1);
    setSearchTerm('');
    setCategory('All');
    window.scrollTo({ top: 0 });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Derived stats
  const progressPct      = modules.length > 0 ? Math.round((completedIds.size / modules.length) * 100) : 0;
  const modulesCompleted = completedIds.size;

  // Derived posture/anatomy/philosophy data
  const filteredAnatomy = useMemo(() =>
    anatomyCards.filter(c =>
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [anatomyCards, searchTerm]);

  const filteredPhilosophy = useMemo(() =>
    philosophyCards.filter(c =>
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [philosophyCards, searchTerm]);

  const filteredPostures = useMemo(() => postures.filter(p =>
    ((p.english_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (p.sanskrit_name || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === 'All' || p.category === category)
  ), [postures, searchTerm, category]);

  const totalPosturePages = Math.ceil(filteredPostures.length / POSTURES_PER_PAGE);
  const paginatedPostures = filteredPostures.slice((posturePage - 1) * POSTURES_PER_PAGE, posturePage * POSTURES_PER_PAGE);


  if (loading) return <LoadingSplash />;

  const pageTitles: Record<string, string> = {
    home:       'Good morning ✿',
    team:       'Our Teachers',
    anatomy:    'Anatomy',
    philosophy: 'Yoga Philosophy',
    teaching:   'Teaching Guidelines',
    postures:   'Postures',
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--cream)' }}>
      <Sidebar
        currentPage={page}
        navigateTo={navigateTo}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        progressPct={progressPct}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={pageTitles[page] ?? ''}
          search={searchTerm}
          setSearch={v => { setSearchTerm(v); setPosturePage(1); }}
          showSearch={(page === 'postures' && !selectedPosture) || (page === 'anatomy' && !selectedAnatomy) || (page === 'philosophy' && !selectedPhil)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1" style={{ background: 'var(--cream)' }}>
          {page === 'home' && (
            <HomePage
              navigateTo={navigateTo}
              postureCount={postures.length}
              bookmarkedCount={bookmarked.size}
              progressPct={progressPct}
              modulesCompleted={modulesCompleted}
              totalModules={modules.length}
              trainingInfo={trainingInfo}
              modules={modules}
              completedIds={completedIds}
            />
          )}

          {page === 'team' && (
            <TeamPage members={teamMembers} navigateTo={navigateTo} />
          )}

          {page === 'anatomy' && (
            <AnatomyPage
              cards={filteredAnatomy}
              categories={anatomyCategories}
              selected={selectedAnatomy}
              setSelected={setSelectedAnatomy}
              navigateTo={navigateTo}
              searchTerm={searchTerm}
            />
          )}

          {page === 'philosophy' && (
            <PhilosophyPage
              cards={filteredPhilosophy}
              categories={philosophyCategories}
              selected={selectedPhil}
              setSelected={setSelectedPhil}
              navigateTo={navigateTo}
              searchTerm={searchTerm}
            />
          )}

          {page === 'teaching' && (
            <ModulesPage
              navigateTo={navigateTo}
              modules={modules}
              completedIds={completedIds}
              onToggle={toggleModule}
              loadingProgress={loadingProgress}
              postures={postures}
              anatomyCards={anatomyCards}
              philosophyCards={philosophyCards}
              teamMembers={teamMembers}
            />
          )}

          {page === 'postures' && (
            <PosturesPage
              postures={postures}
              categories={postureCategories}
              selected={selectedPosture}
              setSelected={setSelectedPosture}
              navigateTo={navigateTo}
              search={searchTerm}
              setSearch={(v: string) => { setSearchTerm(v); setPosturePage(1); }}
              category={category}
              setCategory={setCategory}
              bookmarked={bookmarked}
              toggleBookmark={toggleBookmark}
              page={posturePage}
              setPage={setPosturePage}
              totalPages={totalPosturePages}
              paginated={paginatedPostures}
            />
          )}
        </main>
      </div>
    </div>
  );
}
