'use client';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('/src/components/LandingPage.jsx'), { ssr: false });

export default function Home() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}