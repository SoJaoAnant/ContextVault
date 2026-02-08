'use client';

import React from 'react';

export const DemoDesc = () => {
    return (
        <div className="w-full h-full">
            <div className="
                bg-gray-100
                w-full h-full 
                rounded-2xl 
                border-2 border-gray-400
                shadow-lg
                flex
                overflow-hidden
                ">
                <div className="flex flex-col justify-center items-center w-full h-full px-8 py-2 space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            📹 Demo Video
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            In case the backend is not working, this demo video showcases all the features 😊
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md max-w-2xl w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            ✨ Features Demonstrated:
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span>Document uploading, processing, and storing in a vector database</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span>Chatting with Xeno, our friendly AI companion</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span>Querying documents and getting intelligent responses</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span>Viewing real-time vector database statistics</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-200 rounded-lg p-4 max-w-2xl w-full border border-gray-400">
                        <p className="text-sm text-gray-700 text-center">
                            <span className="font-semibold">Need the backend activated?</span> Contact me at{' '}
                            <a href="mailto:itzanantkumar@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                                itzanantkumar@gmail.com
                            </a>
                            {' '}or{' '}
                            <a href="tel:+919818458007" className="text-blue-600 hover:text-blue-800 underline">
                                +91 98184 58007
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
