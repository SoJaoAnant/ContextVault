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
    <main style={mainStyles}>
      <Header />
      <Hero />
      <div style = {dividerStyles}></div>
      <RAGDiagram />
      <div style = {dividerStyles}></div>
      <UploadSection />
      <div style = {dividerStyles}></div>
      {/* <Switch /> */}
      <SwitchPaglu />
      <Footer />
    </main>
  );
}

// Styles
const mainStyles: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#ffffff',
};

const dividerStyles: React.CSSProperties = {
  width: '100%',
  height: '2px',
  backgroundColor: '#bebcbc',
  margin: '0 auto',
  maxWidth: '1400px',
};

