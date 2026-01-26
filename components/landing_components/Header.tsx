"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


/**
 * Header Component
 * Contains the logo and navigation links
 * 
 * TODO: Replace placeholder logo with actual logo image
 * TODO: Add proper navigation links and routing
 */

export const Header = () => {
  return (
    <header className="w-full py-6 px-8 border-b bg-gray-50 border-gray-400 ">

      <div className="max-w-350 mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/logo.png"
            alt="ContextVault"
            width={100}
            height={100}
            className="object-contain"
          />
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-black">Context</span>
            <span className="text-purple-500">Vault</span>
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/chat"
            className="px-6 py-2 border-2 border-gray-200 bg-gray-100 hover:bg-purple-400 transition text-black rounded font-semibold text-xl cursor-pointer">
            Chat
          </Link>
          <Link
            href="/documents"
            className="px-6 py-2 border-2 border-gray-200 bg-gray-100 hover:bg-purple-400 transition text-black rounded font-semibold text-xl cursor-pointer">
            Documents
          </Link>
        </nav>
      </div>
    </header>
  );
}

