<template>
  <van-action-sheet v-model="value" v-safeBottom cancel-text="取消" :actions="actions" :close-on-click-overlay="false" @cancel="$emit('close')" @click-overlay="$emit('close')" @select="onSelect" />
</template>

<script>
import { imgUpload, dataURLtoBlob, getPermission } from "@utils/lib";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isZip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actions: [{ name: "相机", type: 1 }, { name: "从相册选择", type: 2 }],
    };
  },
  methods: {
    // 选择更换
    onSelect(item) {
      if (!this.$API) {
        this.$toast("仅限App使用");
        return;
      }
      this.$emit("close");
      if (item.type === 1) {
        this.handlerImage("camera", "camera", "相机");
      } else {
        this.handlerImage("photos", "album", "相册");
      }
    },
    async handlerImage(power, type, text) {
      await getPermission([power], text);
      this.$API.getPicture({
        sourceType: type,
        destinationType: "base64"
      }, async (ret) => {
        if (ret.base64Data) {
          const loading = this.$toast.loading("上传中...");
          const blod = await dataURLtoBlob(ret.base64Data);
          const { src } = await imgUpload(blod, this.isZip);
          loading.clear();
          this.$emit("change", src);
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
