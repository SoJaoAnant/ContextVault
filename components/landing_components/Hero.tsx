import { Bluetooth } from 'lucide-react';
import React from 'react';

/**
 * Hero Section Component
 * Main title and call-to-action section
 */

export const Hero = () => {

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="w-full py-16 px-8 text-center">
      <div className="max-w-300 mx-auto mt-20 mb-20 flex flex-col items-center gap-6">
        <h1 className="text-[4rem] font-bold text-black leading-tight mb-4">
          Grounded answers, from your data
        </h1>

        <p className="text-2xl text-gray-600 font-normal mb-4">
          Upload, Manage and Query your documents Powered by an LLM
        </p>

        <button
          className='px-9.5 py-5 border-4 border-purple-300 rounded-xl bg-purple-400 hover:border-purple-400 hover:bg-purple-500 transition font-semibold text-2xl'
          onClick={scrollToBottom}>
          Start Now
        </button>
      </div>
    </section>
  );
}

