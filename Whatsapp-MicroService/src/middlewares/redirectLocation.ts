// Custom middleware to handle the redirection
export default (req, res, next) => {
    const { originalUrl } = req;
    const prefix = '/back';
    if (originalUrl.startsWith(prefix)) {
      // Remove the redundant /v1/ from the URL
      req.url = originalUrl.slice(prefix.length);
    }
    return next();
  };
  