module.exports = compareSomeKeys = (expected, actual) => {
  for (var key in expected) {
    if (actual.key !== expected.key) {
      return false;
    }
  }
  return true;
}