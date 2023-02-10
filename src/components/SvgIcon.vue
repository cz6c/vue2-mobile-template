<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from "@/utils/validata";

export default {
  name: "SvgIcon",
  functional: true,
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    style: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  render: function (h, context) {
    const { icon, style } = context.props;
    const className = context.data.staticClass;
    // 是否是外链，如http,https等
    const isExternalValue = isExternal(icon);
    const iconName = `#icon-${icon}`;
    let svgClass;
    if (className) {
      svgClass = "svg-icon " + className;
    } else {
      svgClass = "svg-icon";
    }
    const styleExternalIcon = {
      mask: `url(${icon}) no-repeat 50% 50%`,
      "-webkit-mask": `url(${icon}) no-repeat 50% 50%`,
    };

    if (isExternalValue) {
      return h("div", {
        class: "svg-external-icon svg-icon",
        attrs: {
          style: styleExternalIcon,
        },
        on: context.listeners,
      });
    } else {
      return h(
        "svg",
        {
          class: svgClass,
          attrs: {
            "aria-hidde": "true",
          },
          style: {
            ...style,
          },
          on: context.listeners,
        },
        [
          h("use", {
            attrs: {
              "xlink:href": iconName,
            },
          }),
        ],
      );
    }
  },
};
</script>
<style scoped lang="scss">
.svg-icon {
  width: 40px;
  height: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
