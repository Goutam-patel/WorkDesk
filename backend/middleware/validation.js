const { validationResult, matchedData } = require('express-validator');

function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map((item) => ({
            field: item.path,
            message: item.msg
          }))
        });
      }

      req.validated = matchedData(req, {
        locations: ['body', 'params', 'query'],
        includeOptionals: true,
        onlyValidData: true
      });

      return next();
    }
  ];
}

module.exports = {
  validate
};
