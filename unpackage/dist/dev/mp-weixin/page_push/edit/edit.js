"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tools = require("../../utils/tools.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uv_number_box2 = common_vendor.resolveComponent("uv-number-box");
  (_easycom_uni_notice_bar2 + _easycom_uni_icons2 + _easycom_uv_number_box2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uv_number_box = () => "../../uni_modules/uv-number-box/components/uv-number-box/uv-number-box.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_icons + _easycom_uv_number_box)();
}
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const awardsList = common_vendor.ref([
      {
        name: "一等奖",
        description: "",
        picUrl: "",
        number: 1,
        id: utils_tools.getUUId()
      },
      {
        name: "二等奖",
        description: "",
        picUrl: "",
        number: 2,
        id: utils_tools.getUUId()
      }
    ]);
    const addAwards = () => {
      awardsList.value.push({
        name: "",
        description: "",
        picUrl: "",
        number: 1,
        id: utils_tools.getUUId()
      });
    };
    const removeAwards = async (index) => {
      let res = await common_vendor.index.showModal({
        title: "是否删除奖项"
      });
      if (res.confirm) {
        awardsList.value.splice(index, 1);
      }
    };
    const ruleText = common_vendor.ref(`1.点击参与报名参加活动;
2.参与后无需额外操作,等待主办方发起抽奖;
3.抽奖成功后会将抽奖结果返回,可在右上角点击查看;
4.将获奖记录给现成工作人员核销后,领取对应的奖品`);
    const addPic = (index) => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          if (res.tempFilePaths.length > 0) {
            common_vendor.index.__f__("log", "at page_push/edit/edit.vue:112", res.tempFilePaths);
            let filePath = res.tempFilePaths[0];
            common_vendor.index.showLoading({
              mask: true,
              title: "上传中"
            });
            common_vendor.er.uploadFile({
              filePath,
              cloudPathAsRealPath: true,
              cloudPath: `raffle/${common_vendor.dayjs_minExports.dayjs().format("YYYYMMDD")}/${utils_tools.getUUId()}_${index}.${utils_tools.getFileExtension()}`,
              success: (res2) => {
                common_vendor.index.__f__("log", "at page_push/edit/edit.vue:123", res2);
                common_vendor.index.hideLoading();
                awardsList.value[index].picUrl = res2.fileID;
              },
              fail: (error) => {
                common_vendor.index.__f__("log", "at page_push/edit/edit.vue:128", error);
                common_vendor.index.hideLoading();
              }
            });
          }
          common_vendor.index.__f__("log", "at page_push/edit/edit.vue:133", res);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          ["show-icon"]: true,
          text: "最多可创建9个奖项,最多支持300人参与游戏抽奖"
        }),
        b: common_vendor.f(awardsList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.picUrl
          }, item.picUrl ? {
            b: item.picUrl
          } : {
            c: "add96f39-1-" + i0,
            d: common_vendor.p({
              type: "image",
              size: "50",
              color: "#555"
            })
          }, {
            e: common_vendor.o(($event) => addPic(index), item.id),
            f: item.name,
            g: common_vendor.o(($event) => item.name = $event.detail.value, item.id)
          }, {
            h: "add96f39-2-" + i0,
            i: common_vendor.p({
              type: "minus-filled",
              size: "30",
              color: "#ee4626"
            })
          }, {
            j: common_vendor.o(($event) => removeAwards(index), item.id),
            k: item.description,
            l: common_vendor.o(($event) => item.description = $event.detail.value, item.id),
            m: "add96f39-3-" + i0,
            n: common_vendor.o(($event) => item.number = $event, item.id),
            o: common_vendor.p({
              modelValue: item.number
            }),
            p: item.id
          });
        }),
        c: common_vendor.o(addAwards),
        d: ruleText.value,
        e: common_vendor.o(($event) => ruleText.value = $event.detail.value)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-add96f39"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_push/edit/edit.js.map
