'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFileContext } from '@/contexts/FileContext';

export const GotoChat = () => {

    const { files } = useFileContext();

    return (
        <section className="w-full h-auto flex justify-center items-center">
            {/* Button */}

            <div className='flex mb-10 flex-col justify-center items-center'>

                <h3
                    className={`
                        text-2xl font-semibold
                        transition-all duration-500 ease-out
                        ${files.length === 0
                            ? 'scale-100 text-black mb-5'
                            : 'scale-[1.2] text-white mb-6'}
                    `}
                    style={
                        files.length === 0
                            ? {}
                            : {
                                textShadow: `
                                    0 0 2px rgba(172, 70, 255,1),
                                    0 0 5px rgba(172, 70, 255,1),
                                    0 0 10px rgba(172, 70, 255,1),
                                    0 0 20px rgba(172, 70, 255,1),
                                    0 0 30px rgba(172, 70, 255,1)
                                `,
                            }
                    }
                >
                    Start chatting with Xeno!
                </h3>


                <Link href="/chat">
                    <button className="group cursor-pointer bg-purple-400 p-5 rounded-full w-30 h-30 flex justify-center items-center border-2 border-purple-500 hover:bg-purple-500 hover:border-purple-400 transition"
                        style={
                            files.length === 0
                                ? {}
                                : {
                                    boxShadow: `
                                        0 0 10px rgba(172, 70, 255,0.8),
                                        0 0 25px rgba(172, 70, 255,0.6)
                                        0 0 30px rgba(172, 70, 255,1)
                                        `,
                                }
                        }>

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