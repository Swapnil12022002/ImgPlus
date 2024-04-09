"use client";

import { useState, useEffect } from "react";
import { responseType } from "@/types/responseTypes";
import { Button } from "@/components/ui/button";
import CustomDropzone from "@/components/CustomDropzone";
import { imageSearch } from "@/api/product";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const ImageSearch: React.FC = () => {
  const [response, setResponse] = useState<responseType | null>(null);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [responseArray, setResponseArray] = useState<
    responseType["search"] | []
  >([]);
  const [productSetId, setProductSetId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<File | null>(null);
  const [searchedImg, setSearchedImg] = useState<File | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (response) {
      setResponseArray(response.search);
      setPreviewImg(null);
      setResponseLoading(false);
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !productSetId) {
      alert(
        "Please enter both the data set name and upload an image to search"
      );
      return;
    }
    setResponseLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("productSetId", productSetId);
    formData.append("file", file as Blob);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    console.log("file", file);
    const serverResponse = await imageSearch(formData);
    setResponse(serverResponse);
    setProductSetId("");
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
        <div className="max-w-lg space-y-1 px-4 sm:mx-auto sm:text-center sm:px-0">
          <h3 className="dark:text-cyan-400 text-blue-950 font-semibold">
            Upload an image search from a pre-trained data set
          </h3>
          <h1 className="dark:text-cyan-400 text-blue-950 font-semibold">
            There are three trained data sets as of now : industry, food and
            homegoods.
          </h1>
        </div>
        <div className="mt-12 mx-auto dark:text-white sm:max-w-lg sm:rounded-xl w-full">
          <Select
            value={productSetId}
            onValueChange={(value: string) => setProductSetId(value)}
          >
            <SelectTrigger className="w-full dark:bg-gray-700 bg-[#f3f3f1]">
              <SelectValue placeholder="Select a data set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industry">Industry</SelectItem>
              <SelectItem value="food_id">Food</SelectItem>
              <SelectItem value="home_goods">Home Goods</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-12 mx-auto dark:text-white sm:max-w-lg sm:rounded-xl w-full">
          {productSetId === "industry"
            ? "Search from a data set of selected industrial drawings"
            : productSetId === "food_id"
            ? "Search from a data set of selected food items (roasted fish, roasted chicken, fresh apple, fresh banana and fresh orange)"
            : productSetId === "home_goods"
            ? "Search from a data set of selected home goods(tv, fan,  light bulb, sofa, bed, table, chair, washing machine, desk and refrigerator)"
            : null}
        </div>
        <div className="mt-12 mx-auto h-[140px] dark:bg-gray-700 bg-[#f3f3f1] sm:max-w-lg sm:rounded-xl cursor-pointer">
          <CustomDropzone
            setFile={setFile}
            setPreviewImg={setPreviewImg}
            setSearchImg={setSearchedImg}
            file={file}
          />
        </div>
        <div className="mt-12 mx-auto px-4  sm:max-w-lg sm:px-8 sm:rounded-xl flex items-center justify-center">
          <Button
            type="submit"
            variant={"outline"}
            className="dark:text-white"
            disabled={responseLoading}
          >
            {responseLoading ? "Loading..." : "Search"}
          </Button>
        </div>
      </form>
      <div className="flex flex-col gap-2 justify-center items-center mt-4">
        {previewImg && file && !responseLoading ? (
          <div className="flex flex-col max-w-[500px] justify-center items-center gap-2">
            <p className="h-[20%]">Image to be Searched : </p>
            <Image
              src={URL.createObjectURL(previewImg)}
              alt="product"
              width={500}
              height={500}
              style={{ width: "100%", height: "100%" }}
              priority={true}
            />
          </div>
        ) : searchedImg && !responseLoading ? (
          <div className="flex flex-col max-w-[500px] justify-center items-center gap-2">
            <p className="h-[20%]">Searched Image : </p>
            <Image
              src={URL.createObjectURL(searchedImg)}
              alt="product"
              width={500}
              height={500}
              style={{ width: 500, height: 500 }}
              priority={true}
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mt-4">
        {responseArray &&
          responseArray?.length > 0 &&
          !responseLoading &&
          !file && <p>Search Results :</p>}
        {responseLoading ? (
          <div className="flex flex-col justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-[500px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[500px]" />
                  <Skeleton className="h-4 w-[500px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          responseArray &&
          responseArray?.length > 0 &&
          !responseLoading &&
          !file &&
          responseArray.map(
            (item, index) =>
              index === 0 && (
                <Card
                  key={index}
                  className="flex flex-col justify-center max-w-[500px] items-center gap-2"
                >
                  <div className="flex justify-center items-center">
                    <p className="text-lg font-semibold dark:text-cyan-400 text-blue-950">
                      Similarity : {Math.round(item.score * 100)}%{" "}
                    </p>
                  </div>
                  <Image
                    src={item.matchedImage}
                    alt="product"
                    width={500}
                    height={500}
                    style={{ width: 500, height: 500 }}
                    priority={true}
                  />
                </Card>
              )
          )
        )}
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

export default ImageSearch;
