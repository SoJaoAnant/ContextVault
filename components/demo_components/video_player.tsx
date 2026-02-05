'use client';

import React from 'react';

export const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <div className="w-full h-full">
            <div className="
                bg-white
                w-full h-full 
                rounded-2xl 
                border-2 border-gray-400
                shadow-md
                flex
                overflow-hidden
                ">
                <video 
                    className="w-full h-full object-contain"
                    controls
                    src={videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
