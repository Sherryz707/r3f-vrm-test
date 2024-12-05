import React from 'react';

const CuteNote = ({ children }) => {
  return (
    <div className="relative w-72 h-72">
      {/* The cute image */}
      <img
        src="/Cute_note.png" // Replace with the path to your PNG image
        alt="Cute Image"
        className="w-full h-full object-cover rounded-lg"
      />
      
      {/* The children will be positioned over the image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CuteNote;
