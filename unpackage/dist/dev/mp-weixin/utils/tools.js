"use strict";
function getUUId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).substring(3, 9);
}
function getFileExtension(filePath) {
  const file = filePath.split(".").pop();
  return file;
}
exports.getFileExtension = getFileExtension;
exports.getUUId = getUUId;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/tools.js.map
