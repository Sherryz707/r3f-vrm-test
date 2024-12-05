import { Suspense } from "react";
import Experience from "./Experience";
import CuteNote from "./Note";

export default function Page() {
  return (
    <div
      className="h-screen w-screen flex bg-cover bg-center"
      style={{
        backgroundImage: "url('/prettz_bg-min.png')", // Replace with your background image URL
      }}
    >
      {/* Left Portion: Experience */}
      <div className="flex justify-center items-center">
      <Suspense fallback={<div>We are loading the model</div>}>
        
        <Experience />
      </Suspense>
      </div>

    </div>
  );
}
