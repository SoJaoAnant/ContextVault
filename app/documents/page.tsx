import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DocumentsPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Documents</h1>
          <p className="text-xl text-gray-600">Documents page coming soon...</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

