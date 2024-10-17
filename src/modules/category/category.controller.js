import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { deleteFile } from "../../utils/fileFunctions.js";
// import { Category } from "./../../../db/models/category.model.js";
// import { Subcategory } from "../../../db/models/subcategory.model.js";
// import { Product } from "../../../db/models/product.model.js";
import { Category, Product, Subcategory } from "../../../db/index.js";
import cloudinary from "../../utils/cloudinary.js";

export const addCategory = async (req, res, next) => {
  // get data
  let { name } = req.body;
  name = name.toLowerCase();

  //check file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }

  // check existence
  const categoryExist = await Category.findOne({ name });

  if (categoryExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  const slug = slugify(name);

  const category = await Category.create({
    name,
    slug,
    image: { path: req.file.path },
  });

  //save
  const createdCategory = await category.save();
  if (!createdCategory) {
    return next(new AppError(messages.failToCreate, 500));
  }

  res.status(201).json({
    message: messages.category.added,
    status: "success",
    data: createdCategory,
  });
};

// get all cat
export const getCategory = async (req, res, next) => {
  const categories = await Category.find().populate([
    { path: "subcategories" },
  ]);

  // const categories = await Category.aggregate([
  //   {
  //     $lookup: {
  //       from: "subcategories",
  //       localField: "_id",
  //       foreignField: "category",
  //       as: "subcategories",
  //     },
  //   },
  // ]);

  if (!categories) {
    return next(new AppError(messages.category.notFound, 404));
  }

  res.status(200).json({
    message: messages.category.found,
    success: true,
    data: categories,
  });
};

// get specific cat
export const getCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError(messages.category.notFound, 404));
  }

  res.status(200).json({
    message: messages.category.found,
    success: true,
    data: category,
  });
};

// update cat
export const updateCategory = async (req, res, next) => {
  // get data
  let { name } = req.body;
  const { categoryId } = req.params;

  //check existence
  const categoryExist = await Category.findById(categoryId);

  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  // check name existence
  const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } });

  if (nameExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }

  // prepare data
  if (name) {
    categoryExist.slug = slugify(name);
  }

  // update image
  if (req.file) {
    deleteFile(categoryExist.image.path);
    categoryExist.image = { path: req.file.path };
  }

  // update
  const updatedCategory = await categoryExist.save();

  if (!updatedCategory) {
    return next(new AppError(messages.failToUpdate, 500));
  }

  res.status(200).json({
    message: messages.category.updated,
    success: true,
    data: updatedCategory,
  });
};

// delete cat
export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId).populate([
    { path: "subcategories", select: "image" },
    { path: "products", select: "mainImg subImgs" },
  ]);

  if (!category) {
    return next(new AppError(messages.category.notFound, 404));
  }

  //prepare ids
  const subcategoryIds = [];
  const productIds = [];
  const imagesPaths = [];
  imagesPaths.push(category.image.path);
  const imagesCloud = [];

  for (let i = 0; i < category.subcategories.length; i++) {
    subcategoryIds.push(category.subcategories[i]._id);
    imagesPaths.push(category.subcategories[i].image.path);
  }
  for (const product of category.products) {
    productIds.push(product._id);
    imagesCloud.push(product.mainImg.public_id);
    product.subImgs.forEach((subImg) => imagesCloud.push(subImg.public_id));
  }

  // delete related subcats
  await Subcategory.deleteMany({ _id: { $in: subcategoryIds } });

  // delete related products
  await Product.deleteMany({ _id: { $in: productIds } });

  // delete images for cat & subcat
  for (const path of imagesPaths) {
    deleteFile(path);
  }

  // delete images for product
  for (const public_id of imagesCloud) {
    await cloudinary.uploader.destroy(public_id);
    // cloudinary.api.delete_resources_by_prefix()
    // cloudinary.api.delete_folder()
  }

  res.status(200).json({
    message: messages.category.deleted,
    success: true,
  });
};
