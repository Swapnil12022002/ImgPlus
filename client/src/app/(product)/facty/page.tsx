"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Hue from "@/components/Hue";
import Loader from "@/components/Loader";

export default function Page() {
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
    <div className="relative flex justify-center items-center">
      <Hue />
      <div className="flex flex-col max-w-[1000px] w-full md:flex-row gap-4 justify-center items-center min-h-screen relative">
        <Link href="/facty/normal-ocr" className="w-full h-full">
          <Card
            className={cn(
              "w-full md:w-[1/3] h-[180px] flex justify-center items-center dark:bg-gray-800"
            )}
          >
            <CardContent>
              <p>Normal OCR Recognition</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/facty/ocr" className="w-full h-full">
          <Card
            className={cn(
              "w-full md:w-[1/3] h-[180px] flex justify-center items-center dark:bg-gray-800"
            )}
          >
            <CardContent>
              <p>OCR Recognition for drawings</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/facty/image-search" className="w-full h-full">
          <Card
            className={cn(
              "w-full md:w-[1/3] h-[180px] flex justify-center items-center dark:bg-gray-800"
            )}
          >
            <CardContent>
              <p>Image Search</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/facty/product-set-upload" className="w-full h-full">
          <Card
            className={cn(
              "w-[1/3] h-[180px] flex justify-center items-center dark:bg-gray-800"
            )}
          >
            <CardContent>
              <p>Image Set Upload (Only for development purposes)</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
