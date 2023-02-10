<template>
  <div>
    <van-cell-group class="radius-input">
      <template v-for="({ key, type = 'input', label, tipsText, maxCount, dateType, format, valueFormat, columns, startKey, endKey, pickerKey, imgKey, valueKey }, i) in formList">
        <!-- 图片上传 -->
        <div v-if="type === 'images'" :key="i" class="img-view">
          <div v-if="(!isReadonly || formData[key].length !== 0) && label" class="dt">
            <span v-if="rules[key] && !isReadonly">*</span>
            {{ label }}
            <b>{{ tipsText }}</b>
          </div>
          <div class="dd">
            <van-uploader v-model="formData[key]" :class="{ readonly: isReadonly }" upload-text="上传照片" :name="imgKey" preview-size="100px" multiple :after-read="afterRead" :max-count="maxCount" />
          </div>
        </div>
        <!-- 时间|日历选择 -->
        <div v-else-if="type === 'datetime'" :key="i" class="time-view" :class="{ readonly: isReadonly }">
          <van-cell :class="{ readonly: isReadonly }" @click="!isReadonly && dateClick({ key, label, dateType, format, valueFormat, startKey, endKey, pickerKey, columns })">
            <template #title><span v-if="rules[key] && !isReadonly">*</span>{{ label }}： </template>
            <template>
              <div class="value-view">
                <div :class="{ value: formData[key] }">
                  {{ formData[key] || `请选择${label}` }}
                </div>
                <van-icon :name="dateIcon" class="time-icon" />
              </div>
            </template>
          </van-cell>
        </div>
        <!-- 下拉选择 -->
        <div v-else-if="type === 'picker'" :key="i" class="picker-view">
          <van-cell :class="{ readonly: isReadonly }" @click="!isReadonly && pickerClick({ key, columns, valueKey })">
            <template #title> <span v-if="rules[key] && !isReadonly">*</span>{{ label }}： </template>
            <template>
              <div class="value-view">
                <div :class="{ value: formData[key] }">
                  {{ formData[key] || `请选择${label}` }}
                </div>
                <van-icon name="play" class="picker-icon" />
              </div>
            </template>
          </van-cell>
        </div>
        <!-- 场馆下拉选择 -->
        <div v-else-if="type === 'venuePicker'" :key="i" class="picker-view">
          <van-cell :is-link="!isReadonly" :class="{ readonly: isReadonly }" @click="!isReadonly && venuePickerClick({ key, columns, valueKey })">
            <template #title> <span v-if="rules[key] && !isReadonly">*</span>{{ label }}： </template>
            <template>
              <div class="value-view">
                <div :class="{ value: formData[key] }">
                  {{ formData[key] || `请选择${label}` }}
                </div>
                <van-icon name="play" class="picker-icon" />
              </div>
            </template>
          </van-cell>
        </div>
        <!-- 输入框 -->
        <van-field v-else :key="i" v-model="formData[key]" :class="{ readonly: isReadonly }" :readonly="isReadonly" :type="type" :placeholder="!isReadonly ? `请输入${label}` : '-'" @focus="focusField" @blur="blurField">
          <template #label> <span v-if="rules[key] && !isReadonly">*</span>{{ label }}： </template>
        </van-field>
      </template>
    </van-cell-group>

    <!-- 时间日期选择器 -->
    <van-popup v-model="showTimePicker" position="bottom">
      <van-datetime-picker v-model="nowDate" :type="nowDateType" :default-date="calendarDefaultDate" :title="nowDateTitle" :formatter="formatter" @confirm="onDateConfirm" @cancel="showTimePicker = false" />
    </van-popup>

    <!-- 选择器 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="nowPickerColumns" @confirm="onPickerConfirm" @cancel="showPicker = false" />
    </van-popup>

    <!-- 日历选择器 -->
    <van-calendar ref="calendar" v-model="showCalendarPicker" :max-date="calendarMaxDate" type="range" :min-date="calendarMinDate" @confirm="onCalendarConfirm" />
    <!-- 日历选择后置 -->
    <van-action-sheet v-model="showActionSheet" :actions="nowActions" cancel-text="取消" @select="onActionConfirm" />

    <!-- 选择场馆 -->
    <van-popup v-model="venueShowPicker" position="right" class="venue-popup" get-container="body" :overlay="false">
      <ChoseVenue @close="venueShowPicker = false" @change="onVenuePickerConfirm" />
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import ChoseVenue from "./ChoseVenue";
import { uploadImage } from "@api/common";

export default {
  components: {
    ChoseVenue,
  },
  props: {
    isReadonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
    formList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      dateIcon: require("@images/info/icon_4.png"),
      // 日历选择后缀
      showActionSheet: false,
      nowActions: [],
      calendarDefaultDate: [],
      calendarMinDate: this.$moment().subtract(1, "month").startOf("month").toDate(),
      calendarMaxDate: this.$moment().add(4, "month").startOf("month").toDate(),
      // 日历相关
      showCalendarPicker: false,
      nowStartKey: "",
      nowEndKey: "",
      nowPickerKey: "",
      // 时间选择控件相关
      showTimePicker: false,
      nowDateType: "date",
      nowDateTitle: "",
      nowDate: new Date(),
      nowKey: "",
      nowFormat: "",
      nowValueFormat: "",
      // 选择器控件相关
      showPicker: false,
      nowPickerColumns: [],
      nowValueKey: "",
      // 暂存时间
      tsStartDate: "",
      tsEndDate: "",
      // 场馆下拉选择
      venueShowPicker: false,
    };
  },
  computed: {
    formData: {
      get() {
        return this.value;
      },
      set(value) {
        console.log(value);
        this.$emit("input", value);
      },
    },
  },
  methods: {
    /**
     * @description: 预览图片
     * @param {*} imgList 图片数组
     * @param {*} index 当前显示
     * @return {*}
     */
    imagePreview(imgList, index) {
      ImagePreview({
        images: imgList,
        startPosition: index,
      });
    },
    /**
     * @description: 上传图片前置事件
     * @param {*} file
     * @return {*}
     */
    async afterRead(file, item) {
      if (file.content) {
        file.status = "uploading";
        file.message = "上传中...";
        this.$emit("uploading");
        try {
          const formData = new FormData();
          formData.append("file", file.file);
          const { fileName: msg } = await uploadImage(formData);
          file[item.name] = msg;
          file.url = msg;
          file.status = "done";
          file.message = "上传成功";
          this.$emit("done");
        } catch (error) {
          file.status = "failed";
          file.message = "上传失败";
          this.$emit("failed");
        }
      } else {
        file.forEach(async x => {
          x.status = "uploading";
          x.message = "上传中...";
          try {
            const formData = new FormData();
            formData.append("file", x.file);
            const { fileName: msg } = await uploadImage(formData);
            x[item.name] = msg;
            x.url = msg;
            x.status = "done";
            x.message = "上传成功";
            this.$emit("done");
          } catch (error) {
            x.status = "failed";
            x.message = "上传失败";
            this.$emit("failed");
          }
        });
      }
    },
    /**
     * @description: 时间选择器确认
     * @param {*} value
     * @return {*}
     */
    onDateConfirm(value) {
      this.formData[this.nowKey] = this.$moment(value).format(this.nowValueFormat);
      this.showTimePicker = false;
    },
    /**
     * @description: 日历选择器确认
     * @param {*} value
     * @return {*}
     */
    onCalendarConfirm(value) {
      const startDate = this.$moment(value[0]).format(this.nowFormat);
      const endDate = this.$moment(value[1]).format(this.nowFormat);

      if (this.nowPickerKey) {
        this.tsStartDate = startDate;
        this.tsEndDate = endDate;
        this.showActionSheet = true;
        this.nowActions = this.nowPickerColumns.map(x => {
          return {
            name: x,
          };
        });
        return;
      } else {
        this.formData[this.nowKey] = `${startDate}-${endDate}`;
        this.formData[this.nowStartKey] = this.$moment(startDate).format(this.nowValueFormat);
        this.formData[this.nowEndKey] = this.$moment(endDate).format(this.nowValueFormat);
      }
      this.showCalendarPicker = false;
    },
    /**
     * @description: 日历后缀确认
     * @param {*} value
     * @return {*}
     */
    onActionConfirm(value) {
      this.formData[this.nowKey] = `${this.tsStartDate}-${this.tsEndDate}`;
      this.formData[this.nowStartKey] = this.$moment(this.tsStartDate).format(this.nowValueFormat);
      this.formData[this.nowEndKey] = this.$moment(this.tsEndDate).format(this.nowValueFormat);

      this.formData[this.nowKey] = `${this.formData[this.nowKey]} ${value.name}`;
      this.formData[this.nowPickerKey] = value.name;
      this.showActionSheet = false;
      this.showCalendarPicker = false;
    },
    /**
     * @description: 时间选择器点击
     * @param {*} key
     * @param {*} label
     * @param {*} dateType
     * @param {*} format
     * @return {*}
     */
    dateClick(item) {
      const { key, label, dateType, format = "YYYY-MM-DD", valueFormat = format, startKey, endKey, pickerKey, columns } = item;
      if (dateType == "calendar") {
        // 日历选择
        const startValue = this.formData[startKey] ? new Date(this.formData[startKey]) : new Date();
        const endValue = this.formData[endKey] ? new Date(this.formData[endKey]) : this.$moment().add(1, "day").toDate();
        console.log([startValue, endValue]);
        this.$refs.calendar.reset([startValue, endValue]);
        this.showCalendarPicker = true;
        this.nowStartKey = startKey;
        this.nowEndKey = endKey;
        this.nowPickerKey = pickerKey;
        this.nowPickerColumns = columns;
      } else {
        // 普通选择
        this.showTimePicker = true;
      }
      this.nowDateType = dateType || "date";
      this.nowDateTitle = label;
      this.nowDate = new Date();
      this.nowKey = key;
      this.nowFormat = format;
      this.nowValueFormat = valueFormat;
    },
    /**
     * @description: 选择器确认
     * @param {*} value
     * @return {*}
     */
    onPickerConfirm(item) {
      // console.log(item);
      // console.log(this.nowKey);
      // console.log(this.nowValueKey);
      if (typeof item === "string") {
        this.formData[this.nowKey] = item;
      } else {
        this.formData[this.nowKey] = item.join("/");
      }
      // this.formData[this.nowKey] = item.text;
      // this.formData[this.nowValueKey] = item.value;
      this.showPicker = false;
    },

    /**
     * @description: 下拉选择点击
     * @param {*} key
     * @param {*} columns
     * @return {*}
     */
    pickerClick({ key, columns, valueKey }) {
      this.showPicker = true;
      this.nowKey = key;
      this.nowValueKey = valueKey;
      this.nowPickerColumns = columns;
    },
    /**
     * @description: 场馆下拉选择点击
     * @param {*} key
     * @param {*} columns
     * @return {*}
     */
    venuePickerClick({ key, valueKey }) {
      this.venueShowPicker = true;
      this.nowKey = key;
      this.nowValueKey = valueKey;
    },
    /**
     * @description: 场馆选择器确认
     * @param {*} value
     * @return {*}
     */
    onVenuePickerConfirm(item) {
      this.formData[this.nowKey] = item.address;
      this.formData[this.nowValueKey] = item.address;
      this.showPicker = false;
    },
    /**
     * @description: 自定义日期选项
     */
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    /**
     * @description: 输入框焦点
     * @param {*}
     * @return {*}
     */
    focusField() {
      const activeElement = document.activeElement;
      let offsetTop = activeElement.offsetTop;
      let offsetParent = activeElement.offsetParent;
      if (activeElement === document.body) {
        return;
      }
      while (offsetParent !== document.body) {
        offsetTop += offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
      }
      // console.log("clientHeight", document.body.clientHeight);
      // console.log(offsetTop); // 距离最外层body的高度
      const viewTop = document.querySelector(".content").offsetTop;
      // console.log(viewTop);// content距离最外层body的高度
      document.querySelector(".container").scrollTop = offsetTop - viewTop - 50;
      // console.log(document.querySelector(".container").scrollTop);
    },
    blurField() {
      // console.log(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.venue-popup {
  width: 100%;
  height: 100%;
}
/deep/.van-calendar {
  .van-calendar__footer {
    padding-bottom: 10px;
  }
}
.radius-input {
  > div {
    margin-bottom: 15px;
  }
  /deep/.van-cell {
    padding: 0;
    display: block;
    margin-bottom: 20px;
    font-size: 16px;

    &__value {
      // 输入框
      .van-field__body {
        position: relative;
        &::before {
          content: "";
          border: 1px solid rgba(54, 81, 255, 0.54);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          z-index: 0;
        }
        .van-field__control {
          border: 2px solid transparent;
          padding: 7px 12px;
          font-size: 16px;
          color: #0a0a0a;
          position: relative;
          z-index: 1;
          transition: 0.3s;
          &:focus {
            border: 2px solid $--color-primary;
          }
          &::placeholder {
            color: #a9a9a9;
          }
        }
      }
      // 下拉框
      .value-view {
        display: flex;
        border: 1px solid rgba(54, 81, 255, 0.54);
        padding: 7px 12px;
        .value {
          color: #000;
        }
        .picker-icon {
          line-height: 24px;
          margin-left: auto;
          margin-right: 0;
          transform: rotate(90deg);
          color: #a3a3a3;
        }
        .time-icon {
          line-height: 24px;
          display: flex;
          align-items: center;
          margin-left: auto;
          margin-right: 0;

          img {
            width: 17px;
            height: 17px;
          }
        }
      }
    }

    &__title {
      width: 100%;
      font-size: 13px;
      font-weight: 600;
      color: #5c5c5c;
      margin-bottom: 7px;
      span {
        color: #ff3300;
        margin-right: 2px;
      }
    }

    &::after {
      display: none;
    }
    .van-icon-arrow {
      position: absolute;
      color: #fff;
    }
  }

  .img-view {
    .dt {
      font-size: 13px;
      font-weight: 600;
      color: #5c5c5c;
      padding-top: 4px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;

      span {
        color: #ff3300;
        margin-left: 3px;
      }

      b {
        margin-left: 12px;
        font-size: 12px;
        color: #999;
        font-weight: normal;
      }
    }

    .dd {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 100px;
        height: 100px;
        margin: 0 13px 13px 0;
        position: relative;

        .van-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
        }

        .close-btn {
          position: absolute;
          border: 1px solid #bfbfbf;
          right: -10px;
          top: -10px;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          color: #bfbfbf;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .readonly {
        .van-uploader__preview-delete,
        .van-uploader__upload {
          display: none;
        }
      }
    }
  }

  &::after {
    display: none;
  }
}
</style>
