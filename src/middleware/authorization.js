export const isAuthorized = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.authUser.role)) {
      return next(new AppError(messages.user.notAuthorized, 401));
    }

    next();
  };
};
