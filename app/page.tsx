'use client'

import {Header} from '@/components/Header';
import {Hero} from '@/components/Hero';
import {RAGDiagram} from '@/components/RAGDiagram';
import {UploadSection} from '@/components/UploadSection';
import {Footer} from '@/components/Footer';
// import {Switch} from '@/components/ui/switch';
import { SwitchPaglu } from '@/components/switch_paglu';

/**
 * Main Landing Page
 * 
 * This is the landing page for ContextVault.
 * It includes:
 * - Header with logo and navigation
 * - Hero section with main title and CTA
 * - RAG System diagram (complex flowchart)
 * - Document upload section
*/


export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Header />
      <Hero />
      <div className="w-full h-0.5 bg-[#bebcbc] mx-auto max-w-[1400px]"></div>
      <RAGDiagram />
      <div className="w-full h-0.5 bg-[#bebcbc] mx-auto max-w-[1400px]"></div>
      <UploadSection />
      {/* <div className="w-full h-0.5 bg-[#bebcbc] mx-auto max-w-[1400px]"></div> */}
      {/* <Switch /> */}
      {/* <SwitchPaglu /> */}
      <Footer />
    </main>
  );
}

