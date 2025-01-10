"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_load_more2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_z_paging2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_list_item + _easycom_uni_list + _easycom_z_paging)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const paging = common_vendor.ref(null);
    common_vendor.ref(null);
    const dataList = common_vendor.ref([]);
    common_vendor.ref([]);
    const queryList = (pageNo, pageSize) => {
      let data = [];
      for (let i = 0; i < pageSize; i++) {
        let item = { id: i, title: Math.random() };
        data.push(item);
      }
      paging.value.complete(data);
    };
    common_vendor.ref(null);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          status: "loading"
        }),
        b: common_vendor.f(dataList.value, (item, k0, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => common_vendor.unref(utils_utils.routeTo)("/page_push/detail/detail"), item),
            c: "a7314210-3-" + i0 + ",a7314210-2"
          };
        }),
        c: common_vendor.p({
          title: "列表文字",
          clickable: true,
          note: "列表描述信息",
          showArrow: true,
          rightText: "右侧文字",
          note: `列表${Date.now()}
已参与10人`
        }),
        d: common_vendor.p({
          ["border-full"]: true
        }),
        e: common_vendor.sr(paging, "a7314210-0", {
          "k": "paging"
        }),
        f: common_vendor.o(queryList),
        g: common_vendor.o(($event) => dataList.value = $event),
        h: common_vendor.p({
          ["default-page-size"]: 15,
          modelValue: dataList.value
        }),
        i: common_vendor.o(($event) => common_vendor.unref(utils_utils.routeTo)("/page_push/edit/edit"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a7314210"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_push/list/list.js.map
