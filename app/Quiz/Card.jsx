import React, { useState } from 'react';
// Custom Tailwind file for animations

const shuffleArray = (arr) => {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
};

const ShufflingCards = ({ items }) => {
  const [shuffledItems, setShuffledItems] = useState(items);
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setShuffledItems(shuffleArray(shuffledItems)); // Shuffle items after animation
      setIsShuffling(false);
    }, 500); // Duration for the shuffle animation
  };

  return (
    <div className="p-4">
      <button
        onClick={shuffle}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Shuffle Cards
      </button>
      <div className="flex justify-center space-x-4">
        {shuffledItems.map((item, index) => (
          <div key={index} className={`flex items-center justify-center animate-bounce-slow hover:shadow-green-glow focus:shadow-green-glow group relative h-72 w-48 overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-3 hover:animate-none focus:outline-none transform transition-transform duration-300 ${isShuffling ? 'animate-shuffle' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}>
            <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out" src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=560&q=80" alt="Card Image" />
            <div className="absolute bottom-0 w-full bg-white bg-opacity-80 py-2 text-center font-bold text-gray-800">Answer {item}</div>
        </div>
        ))}
      </div>
    </div>
  );
};

export const Card = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];

  return <ShufflingCards items={items} />;
};
