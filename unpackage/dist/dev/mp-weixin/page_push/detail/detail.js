"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const menuState = common_vendor.ref(true);
    const pageRoute = common_vendor.ref(getCurrentPages());
    const resultPopup = common_vendor.ref(null);
    const clickAwardPic = () => {
      common_vendor.index.previewImage({
        urls: ["https://mp-7272236e-a94b-4451-b300-3dc88bca7bf7.cdn.bspapp.com/project/raffle-repeat.jpg"]
      });
    };
    const menuChange = () => {
      menuState.value = !menuState.value;
    };
    const runPopup = common_vendor.ref(null);
    const openPopoup = () => {
      resultPopup.value.open();
    };
    const closeResultPopup = () => {
      resultPopup.value.close();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: pageRoute.value > 1
      }, pageRoute.value > 1 ? {
        b: common_vendor.p({
          type: "left",
          size: "26",
          color: "#fff"
        }),
        c: common_vendor.o(($event) => common_vendor.unref(utils_utils.goBack)())
      } : {}, {
        d: common_vendor.p({
          type: "home-filled",
          size: "26",
          color: "#fff"
        }),
        e: common_vendor.o(($event) => common_vendor.unref(utils_utils.routeTo)("/page_push/list/list", "redirectTo")),
        f: common_assets._imports_0$1,
        g: common_vendor.unref(utils_utils.getTitleBarHeight)() + "px"
      }, {}, {}, {}, {}, {
        h: common_vendor.o(openPopoup),
        i: common_vendor.f(6, (item, index, i0) => {
          return {
            a: index,
            b: 6 - index
          };
        }),
        j: common_assets._imports_1,
        k: common_vendor.unref(utils_utils.getStatusBarHeight)() + "px",
        l: common_vendor.f(3, (item, k0, i0) => {
          return {
            a: common_vendor.o(clickAwardPic, item),
            b: item
          };
        }),
        m: common_assets._imports_1,
        n: common_vendor.p({
          type: "gift-filled",
          size: "30"
        }),
        o: common_vendor.p({
          type: "paperplane-filled",
          size: "30"
        }),
        p: common_vendor.p({
          type: "gear-filled",
          size: "30"
        }),
        q: common_vendor.p({
          type: "paperplane-filled",
          size: "30"
        }),
        r: common_vendor.p({
          type: "scan",
          size: "30"
        }),
        s: menuState.value ? 1 : 0,
        t: menuState.value ? "scaleY(1)" : "scaleY(0)",
        v: menuState.value
      }, menuState.value ? {
        w: common_vendor.p({
          type: "closeempty",
          size: "15",
          color: "#fff"
        })
      } : {
        x: common_vendor.p({
          type: "list",
          size: "15",
          color: "#fff"
        })
      }, {
        y: common_vendor.o(menuChange),
        z: common_vendor.sr(runPopup, "49969e35-9", {
          "k": "runPopup"
        }),
        A: common_vendor.p({
          ["is-mask-click"]: false,
          ["mask-background-color"]: "rgba(0,0,0,0.8)"
        })
      }, {}, {
        B: common_assets._imports_2,
        C: common_vendor.o(closeResultPopup),
        D: common_vendor.sr(resultPopup, "49969e35-10", {
          "k": "resultPopup"
        }),
        E: common_vendor.p({
          ["is-mask-click"]: false,
          ["mask-background-color"]: "rgba(0,0,0,0.8)"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-49969e35"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_push/detail/detail.js.map
