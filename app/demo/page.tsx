import { Header } from '@/components/landing_components/Header';

export default function DemoPage() {
    return (
        <main className="relative min-h-screen w-full flex flex-col">

            {/* Dotted Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

            {/* Header */}
            <Header />

            <div className='flex justify-center items-center w-full h-full'>
                <p>
                    Coming Soon....
                </p>
            </div>

        </main>
    );
}