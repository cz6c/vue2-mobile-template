import Vue from "vue";
import moment from "moment";

Vue.filter("formatDate", function (date: number, format = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "-";
  let dateString: string;
  if (String(date).length === 10) {
    date = Number(date + "000");
    dateString = moment(date).format(format);
  } else {
    dateString = moment(new Date(date).getTime()).format(format);
  }
  return dateString;
});
