"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  if (pageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <main>
      <section className="relative h-screen">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl dark:text-white font-extrabold mx-auto md:text-5xl">
              Providing image searching and recognition services for your
              specific needs.
            </h2>
            <p className="max-w-2xl mx-auto dark:text-gray-400">
              Empower your application with tailored image searching and
              recognition solutions, designed to meet your unique requirements.
              Unlock the potential of advanced image analysis capabilities
              customized to your specific needs with our comprehensive service
              offerings.
            </p>
          </div>
          <Link href="/facty" className="flex justify-center items-center mt-5">
            <Button variant={"outline"}>Try Now for free</Button>
          </Link>
        </div>
        <div
          className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          style={{
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
      </section>
    </main>
  );
}
