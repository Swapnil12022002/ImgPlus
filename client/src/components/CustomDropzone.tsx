"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileWithPath } from "@/types/extendedTypes";
import { CustomDropzoneProps } from "@/types/componentTypes";

const baseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: "100%",
  height: "100%",
};

export default function CustomDropzone({
  setFile,
  setPreviewImg,
  setSearchImg,
  setFiles,
  file,
}: CustomDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile ? setFile(acceptedFiles[0]) : setFiles && setFiles(acceptedFiles);
      setPreviewImg && setPreviewImg(acceptedFiles[0]);
      setSearchImg && setSearchImg(acceptedFiles[0]);
    },
    [setFile, setFiles]
  );
  const {
    getRootProps,
    getInputProps,
    fileRejections,
    acceptedFiles,
    isDragActive,
  } = useDropzone({
    multiple: setFile ? false : true,
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/svg+xml": [],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }, index) => {
    return (
      <li key={index}>
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  const style = React.useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="flex justify-center items-center w-full h-full dark:text-white text-black">
          <p>Drop the files here ...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full dark:text-white text-black">
          <p>Drag & drop some files here, or click to select files</p>
          <ul>{file ? files : ""}</ul>
          <ul>{fileRejectionItems}</ul>
        </div>
      )}
    </div>
  );
}
