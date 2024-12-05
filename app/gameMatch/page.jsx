'use client'
import Experience from "./Experience"

const Quiz = () => {
  return (
    <div className="h-screen w-screen flex bg-cover bg-center bg-purple-700"
      >
  {/* Left Side: 3x3 Grid of Cards */}
  <div className="w-1/2 flex justify-end mr-2 items-center">
    <div className="grid grid-cols-3 gap-4">
      {/* Example Cards */}
      {[...Array(6)].map((_, i) => (
        <div class="flex items-center justify-center" key={i}>
  <div class="hover:shadow-green-glow focus:shadow-green-glow group relative h-72 w-48 overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-3 hover:animate-none focus:outline-none">
    <img class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out" src={Math.random() > 0.3 ? './hand1.jpg' : './hand2.jpg'} alt="Card Image" />
    <div class="absolute bottom-0 w-full bg-white bg-opacity-80 py-2 text-center font-bold text-gray-800">Answer</div>
  </div>
</div>
      ))}
    </div>
  </div>
      {/* Right Side: Circular Image */}
      {/* Right Side: Circular Image */}
<div className="w-1/2 flex justify-start ml-3 items-center">
  <Experience />
</div>


</div>

  );
};

export default Quiz;
