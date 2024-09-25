import bcrypt from "bcrypt";
import { Cart, User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";
import { generateToken, verifyToken } from "../../utils/token.js";
import { status } from "../../utils/constant/enums.js";
import { generateOTP } from "../../utils/otp.js";
import { hashPassword } from "../../utils/password.js";

export const signup = async (req, res, next) => {
  let { userName, email, password, phone } = req.body;
  // check existence
  let userExist = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExist) {
    return next(new AppError(messages.user.alreadyExist, 409));
  }
  // prepare data
  password = bcrypt.hashSync(password, 8);

  // save
  const user = new User({
    userName,
    email,
    password,
    phone,
  });
  //add to db
  const createdUser = await user.save();

  if (!createdUser) {
    return next(new AppError(messages.user.failToCreate, 500));
  }

  //generate token
  const token = generateToken({ payload: { email } });
  //send email
  await sendEmail({
    to: createdUser.email,
    subject: "verify your acc",
    html: `<h1>click on link to verify ur acc <a href="${req.protocol}://${req.headers.host}/auth/verify?token=${token}">link</a> </h1>`,
  });

  // send response
  return res.status(201).json({
    message: messages.user.added,
    success: true,
    data: createdUser,
  });
};

export const verifyAcc = async (req, res, next) => {
  const { token } = req.params;
  const payload = verifyToken({ token });
  await User.findOneAndUpdate(
    { email: payload.email, status: status.PENDING },
    { status: status.VERIFIED },
    { new: true }
  );
  //create cart
  await Cart.create({ user: user._id, products: [] });

  return res.status(200).json({
    message: messages.user.verified,
    success: true,
  });
};

export const login = async (req, res, next) => {
  const { email, password, phone } = req.body;

  const userExist = await User.findOne({ $or: [{ email }, { phone }] });

  if (!userExist) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }
  //check pass
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }

  //generate token
  const token = generateToken({
    payload: { email, _id: userExist._id },
    secretKey: process.env.secretKeyAccessToken,
  });
  // send response
  return res.status(200).json({
    message: messages.user.loginSuccessfully,
    success: true,
    data: userExist,
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  //check existence
  const userExist = await User.findOne({ email });

  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }

  //check if has otp
  if (!userExist.otp && userExist.otpExpiry > Date.now()) {
    return next(new AppError("already has otp check ur email", 400));
  }

  //send otp
  const otp = generateOTP();

  // save to user
  userExist.otp = otp;
  userExist.otpExpiry = Date.now() + 15 + 60 + 1000;

  //save to db
  await userExist.save();

  //send email
  await sendEmail({
    to: email,
    subject: "forget password",
    html: `<h1>your otp is ${otp} </h1>`,
  });

  return res.status(200).json({
    success: true,
    message: "otp sent successfully",
  });
};

export const changePassword = async (req, res, next) => {
  const { otp, newPass, email } = req.body;

  //check existence
  const userExist = await User.findOne({ email });

  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }

  if (userExist.otp != otp) {
    return next(new AppError("invalid otp", 400));
  }

  if (userExist.otpExpiry < Date.now()) {
    const resentOtp = generateOTP();
    userExist.otp = resentOtp;
    userExist.otpExpiry = Date.now() + 15 + 60 + 1000;
    await userExist.save();
    await sendEmail({
      to: email,
      subject: "resend otp",
      html: `<h1>your otp is ${resentOtp} </h1>`,
    });

    return res.status(200).json({
      success: true,
      message: "otp resend successfully",
    });
  }
  //hash new pass
  const newHashPassword = hashPassword({ password: newPass });

  userExist.password = newHashPassword;
  userExist.otp = undefined;
  userExist.otpExpiry = undefined;
  //save to db
  await userExist.save();

  return res.status(200).json({
    success: true,
    message: "password changed successfully",
  });
};
