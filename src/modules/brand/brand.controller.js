import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { Brand } from "./../../../db/models/brand.model.js";
import { messages } from "./../../utils/constant/messages.js";
import cloudinary from "../../utils/cloudinary.js";
export const createBrand = async (req, res, next) => {
  // get data
  let { name } = req.body;
  name = name.toLowerCase();
  // check file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }

  // check existence
  const brandExist = await Brand.findOne({ name });

  if (brandExist) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  //prepare data
  const slug = slugify(name);

  // upload img
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "e-comm/brand",
    }
  );

  const brand = await Brand({
    name,
    slug,
    logo: {
      secure_url,
      public_id,
      // todo createdBy
    },
  });
  //add to db
  const createdBrand = await brand.save();
  if (!createdBrand) {
    //rollback
    req.failImage = {
      secure_url,
      public_id,
    };
    return next(new AppError(messages.brand.failToCreate, 500));
  }

  res.status(201).json({
    message: messages.brand.added,
    success: true,
    data: createdBrand,
  });
};

// get all brands
export const getBrands = async (req, res, next) => {
  const brands = await Brand.find();
  if (!brands) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  res.status(200).json({
    message: messages.brand.found,
    success: true,
    data: brands,
  });
};

// get specific brand
export const getBrandById = async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  res.status(200).json({
    message: messages.brand.found,
    success: true,
    data: brand,
  });
};

//update brand
export const updateBrand = async (req, res, next) => {
  const { name } = req.body;
  name = name.toLowerCase();
  const { brandId } = req.params;

  //check brand existence
  const brandExist = await Brand.findById(brandId);
  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  //check name existence
  if (name) {
    const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } });
    if (nameExist) {
      return next(new AppError(messages.brand.alreadyExist, 409));
    }
    brandExist.name = name;
    brandExist.slug = slugify(name);
  }

  //check logo
  if (req.file) {
    //delete old img
    // await cloudinary.uploader.destroy(brandExist.logo.public_id);
    //upload img
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        // folder: "e-comm/brand",
        public_id: brandExist.logo.public_id,
      }
    );
    brandExist.logo = { secure_url, public_id };
  }

  // update db
  const updatedBrand = await brandExist.save();

  if (!updatedBrand) {
    return next(new AppError(messages.brand.failToUpdate, 500));
  }

  res.status(200).json({
    message: messages.brand.updated,
    success: true,
    data: updatedBrand,
  });
};

//delete brand
export const deleteBrand = async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  //delete img
  await cloudinary.uploader.destroy(brand.logo.public_id);
  //delete db
  const deletedBrand = await brand.remove();
  if (!deletedBrand) {
    return next(new AppError(messages.brand.failToDelete, 500));
  }
  res.status(200).json({
    message: messages.brand.deleted,
    success: true,
    data: deletedBrand,
  });
};