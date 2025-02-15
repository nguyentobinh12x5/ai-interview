import React, { Suspense } from "react";
import Loading from "./loading";

const Video = () => {
  return (
    <section className="py-8 bg-indigo-300 rounded-2xl">
      <div className="max-w-screen-xl mx-auto">
        <Suspense fallback={<Loading />}>
          <iframe
            src="https://www.youtube.com/embed/5ZKcfdbA3nQ"
            allowFullScreen
            style={{ width: "100%" }}
            height={600}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default Video;
