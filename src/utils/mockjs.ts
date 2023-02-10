import Mock from "mockjs";
Mock.Random.extend({
  phone: function () {
    const phonePrefixs = ["132", "135", "189", "155", "181"];
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/);
  },
  number: function () {
    return Mock.Random.integer(1, 3);
  },
  array: function (length = 0, json) {
    const arr = Mock.mock({
      "list|30": [json],
    }).list;
    return arr.slice(0, length);
  },
});

export default Mock;
