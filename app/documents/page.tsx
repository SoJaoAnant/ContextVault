import { Header } from '@/components/landing_components/Header';
import { DocumentPrev } from '@/components/chat_components/DocumentPrev';
import { VectorDBStats } from '@/components/docprev_components/VectorDBStats';

export default function DocPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col">

      {/* Dotted Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

      {/* Header */}
      <Header />

      {/* Document Preview UI */}
      <div className="flex w-full min-h-screen">

        <div className="w-full">
          <DocumentPrev />
        </div>

      </div>

      <div className="w-full h-0.5 bg-gray-300 mx-auto max-w-350"></div>

    </main>
  );
}