import { Header } from '@/components/landing_components/Header';
import { VectorDBStats } from '@/components/docprev_components/VectorDBStats';


export default function VecDBPage() {
    return (
        <main className="relative min-h-screen w-full flex flex-col">

            {/* Dotted Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

            {/* Header */}
            <Header />

            {/* Vector Database Stats Section */}
            <div className="flex flex-col items-center w-full flex-1 px-4 py-8 mt-10">
                
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Vector Database Statistics
                </h1>

                {/* Stats Container - Easy to modify width, padding, etc. */}
                <div className="w-full max-w-6xl px-4">
                    <VectorDBStats />
                </div>

            </div>

        </main>
    );
}