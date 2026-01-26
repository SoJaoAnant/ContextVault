import React from 'react';

/**
 * Footer Component
 * Contains "made by Anant with ♥"
 */

export const Footer=()=> {
  return (
    <footer className="w-full p-0 flex justify-center items-center">
      <div className="w-full py-4 px-8 bg-gray-300 rounded flex justify-center items-center">
        <p className="text-base font-normal text-gray-600 m-0">Made with ♥ by Anant</p>
      </div>
    </footer>
  );
}