import { BASE_URL } from "@/lib/base_url";
import axios from "axios";

export const createOCR = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/products/ocr`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: Error | any) {
    console.log(err, "error");
    return err.response.data;
  }
};

export const createNormalOcr = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/products/normal-ocr`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: Error | any) {
    console.log(err, "error");
    return err.response.data;
  }
};

export const createReferenceImage = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/products/create-ref-img`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    return err;
  }
};

export const imageSearch = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/products/image-search`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};
