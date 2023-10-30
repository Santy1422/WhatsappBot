export default (fn: Function) => {
  return function (req, res, next) {
    fn(req, res).catch((e) => {
      next(e);
    });
  };
};
