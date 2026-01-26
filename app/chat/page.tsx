import { Header } from '@/components/landing_components/Header';
import { Footer } from '@/components/landing_components/Footer';
import { ChatUI } from '@/components/chat_components/ChatUI';
import { DocumentPrev } from '@/components/chat_components/DocumentPrev';

export default function ChatPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col">

      {/* Dotted Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1.4px,transparent_1px)] bg-size-[16px_16px]" />

      {/* Content */}
      <Header />

      {/* Main Chatting and Document Preview UI */}
      <div className="flex flex-1 w-full overflow-hidden">

        {/* Chat Area */}
        <div className="w-[35%] h-full">
          <ChatUI />
        </div>

        {/* Document Preview */}
        <div className="w-[65%] h-full">
          <DocumentPrev />
        </div>

      </div>
    </main>
  );
}