import { Header } from '@/components/landing_components/Header';
import { Footer } from '@/components/landing_components/Footer';

export default function DocumentsPage() {

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col">

      {/* Dotted Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

      {/* Content */}
      <Header 
        // padding={"pl-3"}
      />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Documents</h1>
          <p className="text-xl text-gray-600">Documents page coming soon...</p>
        </div>
      </div>
    </main>
  );
}

