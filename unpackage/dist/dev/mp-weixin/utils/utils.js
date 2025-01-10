"use strict";
const common_vendor = require("../common/vendor.js");
const SYSTEM_INFO = common_vendor.index.getSystemInfoSync();
const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;
const getTitleBarHeight = () => {
  if (common_vendor.index.getMenuButtonBoundingClientRect()) {
    let { top, height } = common_vendor.index.getMenuButtonBoundingClientRect();
    return height + (top - getStatusBarHeight()) * 2;
  } else {
    return 40;
  }
};
const routeTo = (url, type = "navigate") => {
  if (type === "navigate") {
    common_vendor.index.navigateTo({
      url
    });
  } else if (type === "redirectTo") {
    common_vendor.index.redirectTo({
      url
    });
  } else if (type === "reLaunch") {
    common_vendor.index.reLaunch({
      url
    });
  } else {
    return "错误信息";
  }
};
const goBack = (back = 1) => {
  common_vendor.index.navigateBack({ back });
};
exports.getStatusBarHeight = getStatusBarHeight;
exports.getTitleBarHeight = getTitleBarHeight;
exports.goBack = goBack;
exports.routeTo = routeTo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/utils.js.map
