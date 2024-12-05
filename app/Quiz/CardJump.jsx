import React, { useState, useEffect, useRef } from 'react';

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
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Initialize card positions
    const initialPositions = Array.from(containerRef.current.children).map((child) => {
      const { offsetLeft, offsetTop } = child;
      return { left: offsetLeft, top: offsetTop };
    });
    setPositions(initialPositions);
  }, [items]);

  const shuffle = () => {
    const shuffled = shuffleArray(shuffledItems);
    setShuffledItems(shuffled);

    // Wait for the DOM update to calculate new positions
    setTimeout(() => {
      const newPositions = Array.from(containerRef.current.children).map((child) => {
        const { offsetLeft, offsetTop } = child;
        return { left: offsetLeft, top: offsetTop };
      });
      setPositions(newPositions);
    }, 0);
  };

  return (
    <div className="p-4">
      <button
        onClick={shuffle}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Shuffle Cards
      </button>
      <div ref={containerRef} className="relative flex justify-center space-x-4">
        {shuffledItems.map((item, index) => (
          <div
            key={index}
            className="absolute h-72 w-48 rounded-xl bg-white shadow-lg transition-all duration-500"
            style={{
              left: positions[index]?.left || 0,
              top: positions[index]?.top || 0,
              transform: `translate(${positions[index]?.left || 0}px, ${positions[index]?.top || 0}px)`,
            }}
          >
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=560&q=80"
              alt="Card Image"
            />
            <div className="absolute bottom-0 w-full bg-white bg-opacity-80 py-2 text-center font-bold text-gray-800">
              {item}
            </div>
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
