import jwt from "jsonwebtoken";

export const generateToken = ({ payload, secretKey = "adl3 elgambary" }) => {
  return jwt.sign(payload, secretKey);
};

export const verifyToken = (token, secretKey = "adl3 elgambary") => {
try {
  return jwt.verify(token, secretKey);
} catch (error) {
    return {message : error.message}
}
};
