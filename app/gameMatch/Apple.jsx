// const Apple = ({ style }) => {
//   return (
//     <div style={style}>
//       <img
//         src={`/apple_${Math.floor(Math.random() * 3) + 1}.png`}
//         alt="Apple"
//         className="w-20 h-20" // Set apple size
//       />
//     </div>
//   );
// };

// export default Apple;

const Apple = ({ style, id, onDragEnd }) => {
  return (
    <div
      style={style}
      draggable="true" // Enable drag-and-drop
      onDragEnd={(event) => {
        const newX = event.clientX;
        const newY = event.clientY;
        onDragEnd(id, newX, newY); // Report the new position after drag ends
      }}
    >
      <img
        src={`/apple_${Math.floor(Math.random() * 3) + 1}.png`}
        alt="Apple"
        className="w-16 h-16" // Set apple size
      />
    </div>
  );
};
export default Apple;