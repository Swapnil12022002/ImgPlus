import fs from "fs";
import {
  OCR,
  addProductToProductSet,
  createProduct,
  createProductSet,
  createReferenceImage,
  deleteProduct,
  deleteProductSet,
  getProductSets,
  getProductsInAProductSet,
  getReferenceImage,
  getSingleProduct,
  normalOCR,
  similarProductSearch,
  updateProduct,
} from "../api/cloudVision.js";
import { uploadImage } from "../api/gcp.js";

export const createOCR = async (req, res) => {
  try {
    console.log(req.file);
    let text = [];
    const filterTexts = await OCR(req.file.path);
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    const drawingCharacters = ["図", "面", "番号"];
    const nameCharacters = ["図", "名"];
    const scaleCharacters = ["尺度"];
    const draftDateCharacters = ["製図", "年月日"];

    if (
      !filterTexts.drawingNumber ||
      !drawingCharacters.every((char) =>
        filterTexts.drawingNumber.includes(char)
      )
    ) {
      return res.status(400).json({ error: "Drawing Number label not found" });
    }
    if (
      !filterTexts.name ||
      !nameCharacters.every((char) => filterTexts.name.includes(char))
    ) {
      return res.status(400).json({ error: "Name label not found" });
    }
    if (
      !filterTexts.scale ||
      !scaleCharacters.every((char) => filterTexts.scale.includes(char))
    ) {
      return res.status(400).json({ error: "Scale label not found" });
    }
    if (
      !filterTexts.draftDate ||
      !draftDateCharacters.every((char) => filterTexts.draftDate.includes(char))
    ) {
      return res.status(400).json({ error: "Draft date label not found" });
    }

    const containsDrawingNumberCharacters = filterTexts.drawingNumber
      .slice(0, drawingCharacters.length)
      .every((val, index) => val === drawingCharacters[index]);
    const containsNameCharacters = filterTexts.name
      .slice(0, nameCharacters.length)
      .every((val, index) => val === nameCharacters[index]);
    const containsScaleCharacters = filterTexts.scale
      .slice(0, scaleCharacters.length)
      .every((val, index) => val === scaleCharacters[index]);
    const containsDraftDateCharacters = filterTexts.draftDate
      .slice(0, draftDateCharacters.length)
      .every((val, index) => val === draftDateCharacters[index]);

    if (containsDrawingNumberCharacters) {
      text.push(
        drawingCharacters.join("") +
          ": " +
          filterTexts.drawingNumber
            .map((val, index) => (index > 2 ? val : ""))
            .join("")
      );
    }
    if (containsNameCharacters) {
      text.push(
        nameCharacters.join("") +
          ": " +
          filterTexts.name.map((val, index) => (index > 1 ? val : "")).join("")
      );
    }
    if (containsScaleCharacters) {
      text.push(
        scaleCharacters.join("") +
          ": " +
          filterTexts.scale.map((val, index) => (index > 0 ? val : "")).join("")
      );
    }
    if (containsDraftDateCharacters) {
      text.push(
        draftDateCharacters.join("") +
          ": " +
          filterTexts.draftDate
            .map((val, index) => (index > 1 ? val : ""))
            .join("")
      );
    }

    text.push("Company: " + filterTexts.company.join(""));

    return res.status(200).json({ text });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createNormalOCR = async (req, res) => {
  try {
    console.log(req.file);
    const text = await normalOCR(req.file.path);
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    return res.status(200).json({ text });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/*export const createProductSet = async (req, res) => {
  try {
    const files = req.files;
    const { display_name } = req.body;
    const hostedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const hostedUrl = await uploadImage(
            fileBuffer,
            file.filename,
            file.mimetype
          );
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          return hostedUrl;
        } catch (err) {
          console.error("Error uploading image ", err);
          throw new Error("Error uploading image ", err);
        }
      })
    );
    const newProductSet = await ProductSet.create({
      display_name,
      images: hostedFiles,
    });
    await createProductSet(newProductSet._id, newProductSet.display_name);
    return res
      .status(201)
      .json({
        message: "Product Set created successfully",
        ProductSet: newProductSet,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
*/

export const createProductSetController = async (req, res) => {
  try {
    const { setId, display_name } = req.body;
    await createProductSet(setId, display_name);
    return res
      .status(201)
      .json({ message: "Product Set created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createProductController = async (req, res) => {
  try {
    const { productId, product_name, description, category } = req.body;
    await createProduct(productId, product_name, description, category);
    return res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addProductToProductSetController = async (req, res) => {
  try {
    const { productId, setId } = req.body;
    await addProductToProductSet(productId, setId);
    return res
      .status(201)
      .json({ message: "Product added to Product Set successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProductsController = async (req, res) => {
  try {
    const { productId, description, key, value } = req.body;
    const product = await updateProduct(productId, description, key, value);
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createReferenceImageController = async (req, res) => {
  try {
    console.log(req.file);
    const file = req.file;
    const fileBuffer = fs.readFileSync(file.path);
    const imageUri = await uploadImage(
      fileBuffer,
      file.filename,
      file.mimetype
    );
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    const { productId, referenceImageId } = req.body;
    const referenceImage = await createReferenceImage(
      productId,
      referenceImageId,
      imageUri
    );
    return res.status(201).json({
      message: "Reference Image created successfully",
      referenceImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProductSetsController = async (req, res) => {
  try {
    const productSets = await getProductSets();
    return res.status(200).json({ productSets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProductsInAProductSetController = async (req, res) => {
  try {
    const { setId } = req.body;
    const productSet = await getProductsInAProductSet(setId);
    return res.status(200).json({ productSet });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await getSingleProduct(productId);
    return res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getReferenceImageController = async (req, res) => {
  try {
    const { productId } = req.body;
    const referenceImage = await getReferenceImage(productId);
    return res.status(200).json({ referenceImage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await deleteProduct(productId);
    return res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const imageSearchController = async (req, res) => {
  try {
    const file = req.file;
    const { productSetId } = req.body;
    const productCategory =
      productSetId === "home_goods" ? "homegoods-v2" : "general-v1";
    const search = await similarProductSearch(
      productSetId,
      productCategory,
      file.path
    );
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    return res.status(200).json({ search });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProductSetController = async (req, res) => {
  try {
    const { setId } = req.body;
    await deleteProductSet(setId);
    return res
      .status(200)
      .json({ message: "Product Set deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
