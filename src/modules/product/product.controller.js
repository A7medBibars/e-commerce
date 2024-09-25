import { AppError } from "../../utils/appError.js";
import { messages } from "./../../utils/constant/messages.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import { Subcategory, Brand, Product } from "./../../../db/index.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
// import { Subcategory } from "./../../../db/models/subcategory.model.js";
// import { Brand } from "./../../../db/models/brand.model.js";
// import { Product } from "../../../db/models/product.model.js";

// add product
export const addProduct = async (req, res, next) => {
  // get data
  const {
    name,
    description,
    price,
    category,
    subcategory,
    brand,
    discount,
    stock,
    discountType,
    colors,
    sizes,
  } = req.body;

  // check brand existence
  const brandExist = await Brand.findById(brand);

  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }

  //check subcategory existence
  const subcategoryExist = await Subcategory.findById(subcategory);
  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  // prepare
  const slug = slugify(name);

  //uploads
  let failImage = [];
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImg[0].path,
    {
      folder: "e-comm/product/mainImage",
    }
  );
  failImage.push(public_id);
  let mainImg = { secure_url, public_id };

  let subImgs = [];
  for (const file of req.files.subImgs) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: "e-comm/product/subImages",
      }
    );
    subImgs.push({ secure_url, public_id });
    failImage.push(public_id);
  }

  //add to db
  const product = await Product({
    name,
    slug,
    description,
    price,
    category,
    subcategory,
    brand,
    discount,
    stock,
    discountType,
    colors,
    sizes,
    mainImg,
    subImgs,
  });

  const createdProduct = await product.save();

  if (!createdProduct) {
    req.failImage = failImage;
    return next(new AppError(messages.product.failToCreate, 500));
  }

  res.status(201).json({
    message: messages.product.created,
    success: true,
    data: createdProduct,
  });
};

// get all products
export const getAllProducts = async (req, res, next) => {


  const apiFeatures = new ApiFeatures(Product.find(), req.query).pagination().sort().select().filter()

  const products = await apiFeatures.mongooseQuery;
  
  res.status(200).json({
    message: messages.product.found,
    success: true,
    data: products,
  });

  // let { page, size, sort, select, ...filter } = req.query;

  // filter = JSON.parse(
  //   JSON.stringify(filter).replace(/gt|gte|lt|lte/g, (match) => `$${match}`)
  // );

  

  // select = select?.replaceAll(",", " ");
  // const mongooseQuery = Product.find(filter);
  // // mongooseQuery.limit(size).skip(skip);
  // mongooseQuery.sort(sort).select(select);
  // const products = await mongooseQuery;
  // if (!products) {
  //   return next(new AppError(messages.product.notFound, 404));
  // }
};

// get specific product

export const getProductById = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }
  res.status(200).json({
    message: messages.product.found,
    success: true,
    data: product,
  });
};

// update product
export const updateProduct = async (req, res, next) => {
  const { name } = req.body;
  const { productId } = req.params;

  //check existence
  const productExist = await Product.findById(productId);

  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }

  //check name existence
  const nameExist = await Product.findOne({
    name,
    _id: { $ne: productId },
  });

  if (nameExist) {
    return next(new AppError(messages.product.alreadyExist, 400));
  }

  //prepare data
  if (name) {
    productExist.slug = slugify(name);
  }
  // update image
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.mainImg[0].path,
      {
        folder: "e-comm/product/mainImage",
      }
    );
    productExist.mainImg = { secure_url, public_id };
  }

  // update
  const updatedProduct = await productExist.save();
  if (!updatedProduct) {
    return next(new AppError(messages.failToUpdate, 500));
  }
  res.status(200).json({
    message: messages.product.updated,
    success: true,
    data: updatedProduct,
  });
};

// delete product

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }
  const deletedProduct = await product.remove();
  if (!deletedProduct) {
    return next(new AppError(messages.failToDelete, 500));
  }
  res.status(200).json({
    message: messages.product.deleted,
    success: true,
    data: deletedProduct,
  });
};
