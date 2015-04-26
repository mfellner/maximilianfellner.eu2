/**
 * Determine beyond reasonable doubt, that the script is running on the server- or client-side.
 *
 * @returns {boolean} True if the script is executed on the server, false otherwise.
 */
function isServerside() {
  // The following attributes of 'process' are typically only set on the server-side.
  return typeof process === 'object' && process.version && process.platform
}

module.exports.isServerside = function () {
  return isServerside();
};

module.exports.isClientside = function () {
  return !isServerside();
};
