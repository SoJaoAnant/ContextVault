'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const GotoChat = () => {
    return (
        <section className="w-full h-auto flex justify-center items-center">
            {/* Button */}

            <div className='flex mb-10 flex-col justify-center items-center'>

                <h3 className='text-2xl font-semibold mb-5'>
                    Start Chatting!
                </h3>
                <Link href="/chat">
                    <button className="group cursor-pointer bg-purple-400 rounded-full w-30 h-30 flex justify-center items-center border-2 border-purple-500 hover:bg-purple-500 hover:border-purple-400 transition">

                        {/* Default image */}
                        <Image
                            src="/bobot_1.png"
                            alt="ContextVault"
                            width={100}
                            height={100}
                            className="object-contain group-hover:hidden"
                        />

                        {/* Hover image */}
                        <Image
                            src="/bobot_2.png"
                            alt="ContextVault Hover"
                            width={100}
                            height={100}
                            className="object-contain hidden group-hover:block"
                        />
                    </button>
                </Link>


            </div>
        </section>
    );
}