'use client'

import { Header } from '@/components/landing_components/Header';
import { Hero } from '@/components/landing_components/Hero';
import { RAGDiagram } from '@/components/landing_components/RAGDiagram';
import { UploadSection } from '@/components/landing_components/UploadSection';
import { UploadSectionTitle } from '@/components/landing_components/UploadSectionTitle';
import { RAGDiagramTitle } from '@/components/landing_components/RAGDiagramTitle';
import { Footer } from '@/components/landing_components/Footer';
import { GotoChat } from '@/components/landing_components/goto_chat';
import { UserForm } from '@/components/landing_components/user_form';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-y-auto no-scrollbar">

      {/* Dotted Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

      {/* Content */}
      <Header />
      <Hero />
      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>
      <UploadSectionTitle />
      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>
      <UploadSection />
      <GotoChat />
      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>
      <RAGDiagramTitle />
      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>
      <RAGDiagram />
      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>
      <UserForm />
      <Footer />

    </main>
  );
}


