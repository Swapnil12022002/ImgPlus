"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CustomDropzone from "@/components/CustomDropzone";
import { createReferenceImage } from "@/api/product";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";

const ProductSetUpload: React.FC = () => {
  const [productId, setProductId] = useState<string>("");
  const [imageId, setImageId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setPageLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("imageId", imageId);
    formData.append("file", file as Blob);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    console.log("file", file);
    await createReferenceImage(formData);
    setProductId("");
    setImageId("");
    setFile(null);
  };

  if (pageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <main className="relative py-28 h-screen">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8"
      >
        <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
          <h3 className="dark:text-cyan-400 text-blue-950 font-semibold">
            Upload multiple images to create a product Set to search from
          </h3>
        </div>
        <Input
          type="text"
          placeholder="Enter the product id"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-12 mx-auto dark:bg-gray-700 bg-[#f3f3f1] dark:text-white sm:max-w-lg sm:rounded-xl px-4 py-2 w-full sm:px-8 sm:py-3 sm:w-full"
        />
        <Input
          type="text"
          placeholder="Enter the image id"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          className="mt-12 mx-auto dark:bg-gray-700 bg-[#f3f3f1] dark:text-white sm:max-w-lg sm:rounded-xl px-4 py-2 w-full sm:px-8 sm:py-3 sm:w-full"
        />
        <div className="mt-12 mx-auto h-[140px] dark:bg-gray-700 bg-[#f3f3f1] sm:max-w-lg sm:rounded-xl cursor-pointer">
          <CustomDropzone setFile={setFile} file={file} />
        </div>
        <div className="mt-12 mx-auto px-4  sm:max-w-lg sm:px-8 sm:rounded-xl flex items-center justify-center">
          <Button type="submit" variant={"outline"} className="dark:text-white">
            Submit
          </Button>
        </div>
      </form>
      <div
        className="absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
        style={{
          background:
            "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
        }}
      ></div>
    </main>
  );
};

export default ProductSetUpload;
