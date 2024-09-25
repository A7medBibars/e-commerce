import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { Subcategory } from "../../../db/models/subcategory.model.js";
import { deleteFile } from "../../utils/fileFunctions.js";

// add sub cat
export const addSubCategory = async (req, res, next) => {
  // get data
  const { name, categoryId } = req.body;

  // check file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }
  // check category existence
  const categoryExist = await Category.findById(categoryId);

  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }

  //check name existence
  const nameExist = await Subcategory.findOne({ name, category: categoryId });

  if (nameExist) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }

  // prepare data
  const slug = slugify(name);

  const subcategory = await Subcategory.create({
    name,
    slug,
    category: categoryId,
    image: { path: req.file.path },
  });

  //save
  const createdSubcategory = await subcategory.save();
  if (!createdSubcategory) {
    return next(new AppError(messages.failToCreate, 500));
  }

  res.status(201).json({
    message: messages.subcategory.added,
    success: true,
    data: createdSubcategory,
  });
};

// get sub cat
export const getSubCategory = async (req, res, next) => {
  // get data
  const { categoryId } = req.params;

  //check cat existence
  const categoryExist = await Category.findById(categoryId);

  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }

  const subcategories = await Subcategory.find({
    category: categoryId,
  }).populate([{ path: "category" }]);

  if (!subcategories) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }

  res.status(200).json({
    message: messages.subcategory.found,
    success: true,
    data: subcategories,
  });
};

// update sub cat
export const updateSubCategory = async (req, res, next) => {
  // get data
  const { name } = req.body;
  const { subcategoryId } = req.params;

  //check existence
  const subcategoryExist = await Subcategory.findById(subcategoryId);

  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }

  //check name existence
  const nameExist = await Subcategory.findOne({
    name,
    _id: { $ne: subcategoryId },
  });

  if (nameExist) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }

  // prepare data
  if (name) {
    subcategoryExist.slug = slugify(name);
  }

  // update image
  if (req.file) {
    deleteFile(subcategoryExist.image.path);
    subcategoryExist.image = { path: req.file.path };
  }

  // update
  const updatedSubcategory = await subcategoryExist.save();
  if (!updatedSubcategory) {
    return next(new AppError(messages.failToUpdate, 500));
  }

  res.status(200).json({
    message: messages.subcategory.updated,
    success: true,
    data: updatedSubcategory,
  });
};

// delete sub cat
export const deleteSubCategory = async (req, res, next) => {
  const { subcategoryId } = req.params;

  const subcategoryExist = await Subcategory.findById(subcategoryId);

  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }

  const deletedSubcategory = await Subcategory.findOneAndDelete(
    subcategoryExist
  );

  if (!deletedSubcategory) {
    return next(new AppError(messages.failToDelete, 500));
  }

  res.status(200).json({
    message: messages.subcategory.deleted,
    success: true,
    data: deletedSubcategory,
  });
};
