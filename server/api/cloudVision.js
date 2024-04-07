import vision from "@google-cloud/vision";
import dotenv from "dotenv";
import fs from "fs";
import { generateSignedUrl } from "./gcp.js";
import { keyFilename } from "../common/keyFileName.js";
import { filteredImgObjects } from "../utils/targetAreas.js";

dotenv.config();

const searchClient = new vision.ProductSearchClient({
  keyFilename,
});
const ImageClient = new vision.ImageAnnotatorClient({
  keyFilename,
});
const projectId = process.env.GCP_PROJECT_ID || "";
const location = process.env.GCP_LOCATION || "";

const locationPath = searchClient.locationPath(projectId, location);

export const OCR = async (imagePath) => {
  const [result] = await ImageClient.textDetection(imagePath, {
    imageContext: {
      languageHints: ["ja"],
      textDetectionParams: {
        enableTextDetectionConfidenceScore: true,
        model: "builtin/latest",
        orientationParams: {
          enableTextOrientationDetection: true,
        },
      },
    },
  });
  const detections = result.textAnnotations;
  const filteredObjects = filteredImgObjects(detections);
  console.log(filteredObjects);
  const textArray = detections.map((text) => {
    // console.log("Text: ");
    // console.log(text.description);
    // console.log(text.boundingPoly.vertices);
    return text?.description;
  });
  return filteredObjects;
};

export const normalOCR = async (imagePath) => {
  const [result] = await ImageClient.textDetection(imagePath);
  const detections = result.textAnnotations;
  const textArray = detections.map((text) => {
    return text?.description;
  });
  return textArray.join(" ");
};

export const createProductSet = async (productSetId, productSetDisplayName) => {
  const productSet = {
    displayName: productSetDisplayName,
  };

  const request = {
    parent: locationPath,
    productSet: productSet,
    productSetId: productSetId,
  };

  const [createdProductSet] = await searchClient.createProductSet(request);
  console.log(`Product Set Id: ${productSetId}`);
  console.log(`Product Set name: ${createdProductSet.name}`);
};

export const createProduct = async (
  productId,
  productDisplayName,
  productDescription,
  productCategory
) => {
  const product = {
    displayName: productDisplayName,
    description: productDescription,
    productCategory: productCategory,
  };

  const request = {
    parent: locationPath,
    product: product,
    productId: productId,
  };

  const [createdProduct] = await searchClient.createProduct(request);
  console.log(`Product Id: ${productId}`);
  console.log(`Product name: ${createdProduct.name}`);
};

export const addProductToProductSet = async (productId, productSetId) => {
  const productPath = searchClient.productPath(projectId, location, productId);
  const productSetPath = searchClient.productSetPath(
    projectId,
    location,
    productSetId
  );

  const request = {
    name: productSetPath,
    product: productPath,
  };

  await searchClient.addProductToProductSet(request);
  console.log(`Product added to product set.`);
};

export const updateProduct = async (productId, description, key, value) => {
  const productPath = searchClient.productPath(projectId, location, productId);
  const [existingProduct] = await searchClient.getProduct({
    name: productPath,
  });
  const product = {
    name: productPath,
    description: description,
    productLabels: [
      ...existingProduct.productLabels,
      {
        key: key,
        value: value,
      },
    ],
  };

  const updateMask = {
    paths: ["description", "product_labels"],
  };

  const request = {
    product: product,
    updateMask: updateMask,
  };

  const [updatedProduct] = await searchClient.updateProduct(request);
  console.log(`Product updated.`);
  return updatedProduct;
};

export const createReferenceImage = async (
  productId,
  referenceImageId,
  gcsUri
) => {
  const formattedParent = searchClient.productPath(
    projectId,
    location,
    productId
  );

  const referenceImage = {
    uri: gcsUri,
  };

  const request = {
    parent: formattedParent,
    referenceImage: referenceImage,
    referenceImageId: referenceImageId,
  };

  const [response] = await searchClient.createReferenceImage(request);
  console.log(`response.name: ${response.name}`);
  console.log(`response.uri: ${response.uri}`);
  return response;
};

export const getProductSets = async () => {
  const [productSets] = await searchClient.listProductSets({
    parent: locationPath,
  });
  productSets.forEach((productSet) => {
    console.log(`Product Set name: ${productSet.name}`);
    console.log(`Product Set display name: ${productSet.displayName}`);
  });
  return productSets;
};

export const getProductsInAProductSet = async (productSetId) => {
  const productSetPath = searchClient.productSetPath(
    projectId,
    location,
    productSetId
  );
  const request = {
    name: productSetPath,
  };
  const [products] = await searchClient.listProductsInProductSet(request);
  products.forEach((product) => {
    console.log(`Product name: ${product.name}`);
    console.log(`Product display name: ${product.displayName}`);
    console.log(`Product description: ${product.description}`);
  });
  return products;
};

export const getSingleProduct = async (productId) => {
  const productPath = searchClient.productPath(projectId, location, productId);
  const request = {
    name: productPath,
  };
  const [product] = await searchClient.getProduct(request);
  return product;
};

export const getReferenceImage = async (productId) => {
  const formattedParent = searchClient.productPath(
    projectId,
    location,
    productId
  );
  const request = {
    parent: formattedParent,
  };

  const [response] = await searchClient.listReferenceImages(request);
  response.forEach((image) => {
    console.log(`image.name: ${image.name}`);
    console.log(`image.uri: ${image.uri}`);
  });
  return response;
};

export const deleteProduct = async (productId) => {
  const productPath = searchClient.productPath(projectId, location, productId);
  const request = {
    name: productPath,
  };
  await searchClient.deleteProduct(request);
  console.log(`Product deleted.`);
};

export const deleteReferenceImg = async (productId, referenceImageId) => {
  const referenceImagePath = searchClient.referenceImagePath(
    projectId,
    location,
    productId,
    referenceImageId
  );
  const request = {
    name: referenceImagePath,
  };
  await searchClient.deleteReferenceImage(request);
  console.log(`Reference Image deleted.`);
};

export const similarProductSearch = async (
  productSetId,
  productCategory,
  filePath
) => {
  const filter = "";

  const productSetPath = searchClient.productSetPath(
    projectId,
    location,
    productSetId
  );

  const content = fs.readFileSync(filePath, "base64");

  const request = {
    image: { content: content },
    features: [{ type: "PRODUCT_SEARCH" }],
    imageContext: {
      productSearchParams: {
        productSet: productSetPath,
        productCategories: [productCategory],
        filter: filter,
      },
    },
  };

  const [response] = await ImageClient.batchAnnotateImages({
    requests: [request],
  });

  console.log("Search Image:", filePath);
  console.log(response);
  let responseArray = [];
  if (response.responses[0].productSearchResults?.productGroupedResults[0]) {
    responseArray = await Promise.all(
      response.responses[0].productSearchResults?.productGroupedResults[0]?.results.map(
        async (result) => {
          const referenceImages = await getReferenceImage(
            result.product.name.split("/")[5]
          );
          const matchedImage = referenceImages.find(
            (image) => image.name === result.image
          );
          const image = await generateSignedUrl(matchedImage.uri);
          return {
            product: result.product.name.split("/")[5],
            score: result.score,
            matchedImage: image,
          };
        }
      )
    );
    console.log("responseArray:", responseArray);
    return responseArray;
  } else {
    console.log("error", response.responses[0].error);
    return response.responses[0].error;
  }
};

export const deleteProductSet = async (productSetId) => {
  const productSetPath = searchClient.productSetPath(
    projectId,
    location,
    productSetId
  );
  const request = {
    name: productSetPath,
  };
  await searchClient.deleteProductSet(request);
  console.log(`Product Set deleted.`);
};
