"use client";

import { useState, useEffect } from "react";
import { normalOcrResponse } from "@/types/responseTypes";
import { createNormalOcr } from "@/api/product";
import Loader from "@/components/Loader";
import CustomDropzone from "@/components/CustomDropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const OCR: React.FC = () => {
  const [response, setResponse] = useState<normalOcrResponse | null>(null);
  const [err, setErr] = useState<string>("");
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [responseText, setResponseText] =
    useState<normalOcrResponse["text"]>("");
  const [file, setFile] = useState<File | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (response) {
      setResponseText(response.text);
      setResponseLoading(false);
    }
    if (err) {
      setResponseLoading(false);
    }
  }, [response, err]);

  console.log(responseText, "responseText");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setResponseLoading(true);
    setResponse(null);
    setErr("");
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file as Blob);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const serverResponse = await createNormalOcr(formData);
    console.log(serverResponse, "serverResponse");
    if (serverResponse.error) {
      setErr(serverResponse.error);
    } else {
      setResponse(serverResponse);
    }
    setFile(null);
  };

  if (pageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <main className="relative py-28 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8"
      >
        <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
          <h3 className="dark:text-cyan-400 text-blue-950 font-semibold">
            Upload image
          </h3>
        </div>
        <div className="mt-12 mx-auto h-[140px] dark:bg-gray-700 bg-[#f3f3f1] sm:max-w-lg sm:rounded-xl cursor-pointer">
          <CustomDropzone setFile={setFile} file={file} />
        </div>
        <div className="mt-12 mx-auto px-4  sm:max-w-lg sm:px-8 sm:rounded-xl flex items-center justify-center">
          <Button
            type="submit"
            variant={"outline"}
            className="dark:text-white"
            disabled={responseLoading}
          >
            {responseLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
      <div className="max-w-lg mx-auto mt-12">
        {responseLoading ? (
          <div className="flex justify-center items-center">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[500px]" />
                <Skeleton className="h-4 w-[500px]" />
              </div>
            </div>
          </div>
        ) : responseText && responseText?.length > 0 ? (
          <div className="dark:text-white text-black flex flex-col justify-center items-center gap-3">
            The following information has been extracted from the image :{" "}
            <p>{responseText}</p>
          </div>
        ) : response && responseText && responseText?.length === 0 ? (
          <p className="dark:text-white text-black">No text found</p>
        ) : err ? (
          <p className="dark:text-white text-black flex justify-center items-center">
            {err}
          </p>
        ) : null}
      </div>
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

export default OCR;
