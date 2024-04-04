import express from "express";
import {
  addProductToProductSetController,
  createNormalOCR,
  createOCR,
  createProductController,
  createProductSetController,
  createReferenceImageController,
  deleteProductController,
  deleteProductSetController,
  getProductSetsController,
  getProductsInAProductSetController,
  getReferenceImageController,
  getSingleProductController,
  imageSearchController,
  updateProductsController,
} from "../controllers/product.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/ocr").post(upload.single("file"), createOCR);
router.route("/normal-ocr").post(upload.single("file"), createNormalOCR);
/*router
  .route("/create-product-set")
  .post(upload.array("files"), createProductSetController);*/
router.route("/create-product-set").post(createProductSetController);
router.route("/create-product").post(createProductController);
router.route("/add-product").post(addProductToProductSetController);
router.route("/update-product").put(updateProductsController);
router.route("/get-product-sets").get(getProductSetsController);
router.route("/get-products").get(getProductsInAProductSetController);
router
  .route("/create-ref-img")
  .post(upload.single("file"), createReferenceImageController);
router.route("/get-product").get(getSingleProductController);
router.route("/get-ref-img").get(getReferenceImageController);
router.route("/delete-product").delete(deleteProductController);
router
  .route("/image-search")
  .post(upload.single("file"), imageSearchController);
router.route("/delete-product-set").delete(deleteProductSetController);

export default router;
