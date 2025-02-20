"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import WaitlistDialog from "./waitlistDialog";

const Banner = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center lg:h-screen">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Ace Your Next Interview with{" "}
            <strong className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              AI-Powered
            </strong>
            🚀
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Boost your confidence, refine your answers, and land your dream job
            with your AI Interview Copilot. We are launching!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center px-8">
            <Button 
              size="lg"
              onClick={() => setIsWaitlistOpen(true)}
              className="w-full sm:w-auto"
            >
              Join Waitlist
            </Button>
          </div>
          {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded-sm bg-indigo-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:ring-3 focus:outline-hidden sm:w-auto"
              href="/resume"
            >
              Get Started
            </Link>

            <Link
              className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:text-indigo-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              href="#"
            >
              Learn More
            </Link>
          </div> */}
        </div>
      </div>

      <WaitlistDialog 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </section>
  );
};

export default Banner;
