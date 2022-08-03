const isValid = function (str) {
  if (str != undefined && str != null && str.length > 0) return true;
  return false;
};

module.exports = isValid;
