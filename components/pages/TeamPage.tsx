'use client';

import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';
import { RichContent } from '@/components/ui/RichContent';
import { FALLBACKS } from '@/lib/constants';
import type { TeamMember } from '@/lib/types';

export const TeamPage = ({ members, navigateTo }: { members: TeamMember[]; navigateTo: (p: string) => void }) => (
  <div className="page-enter p-6 md:p-10 max-w-5xl mx-auto">
    <BackButton onClick={() => navigateTo('home')} label="Dashboard" />
    <div className="mb-10">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--charcoal)', fontStyle: 'italic', marginBottom: 8 }}>
        Meet your teachers
      </h2>
      <p style={{ color: 'var(--mid-gray)', fontSize: 15 }}>
        Our dedicated instructors will guide you through every step of your journey.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 gap-6">
      {members.map(member => (
        <div
          key={member.id}
          className="card-lift flex flex-col overflow-hidden rounded-2xl"
          style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
            <Image
              src={member.imageUrl || FALLBACKS.team}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="p-6">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--charcoal)', marginBottom: 8 }}>
              {member.name}
            </h3>
            <RichContent
              html={member.description}
              style={{ color: 'var(--mid-gray)', fontSize: 14, lineHeight: 1.7 }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
