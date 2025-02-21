import React, { Suspense } from "react";
import Loading from "./loading";

const Video = () => {
  return (
    <section className="py-8 bg-indigo-300 rounded-2xl">
      <div className="max-w-screen-xl mx-auto flex justify-center">
        <Suspense fallback={<Loading />}>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/f-BBP3qRvvo"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </Suspense>
      </div>
    </section>
  );
};

export default Video;
