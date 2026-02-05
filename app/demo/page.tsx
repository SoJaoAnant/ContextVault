import { Header } from '@/components/landing_components/Header';
import { VideoPlayer } from '@/components/demo_components/video_player';
import { DemoDesc } from '@/components/demo_components/demo_desc';

export default function DemoPage() {
    return (
        <main className="relative min-h-screen w-full flex flex-col">

            {/* Dotted Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

            {/* Header */}
            <Header />

            <div className="flex flex-1 gap-4 p-4 w-full">

                {/* Texts */}
                <div className="w-[36%]">
                    <DemoDesc />
                </div>

                {/* Video player */}
                <div className="w-[65%]">
                    <VideoPlayer videoUrl='demo_video.mp4'/>
                </div>

            </div>
        </main>
    );
}