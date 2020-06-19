import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind(el) {
    let hasDot = false;

    el.addEventListener("input", (event) => {
      let formattedValue = event.target.value;
      let lastIntroduced = formattedValue[formattedValue.length - 1];
      let valueWithoutLast = formattedValue.slice(0, -1);
      let ifMinus = el.value.length === 1 && lastIntroduced === "-";
      let ifFirstDot = formattedValue.length === 1 && lastIntroduced === ".";
      let ifDotAfterMinus = lastIntroduced === "." && valueWithoutLast[valueWithoutLast.length - 1] === "-";
      let lastIsDot = formattedValue[formattedValue.length - 1] === "." && hasDot;
      let ifDoubleDot = lastIntroduced === "." && valueWithoutLast.includes(".");

      if (!formattedValue.includes(".")) {
        hasDot = false;
      }

      if (ifMinus) {
        el.value = lastIntroduced;
      } else if (lastIsDot) {
        el.value = formattedValue;
        hasDot = true;
      } else if (ifFirstDot || ifDotAfterMinus) {
        el.value = valueWithoutLast;
      } else if (lastIntroduced === "." && !hasDot) {
        el.value = formattedValue;
        hasDot = true;
      } else if (isNaN(lastIntroduced) || lastIntroduced === " ") {
        el.value = valueWithoutLast;
      }

      if (ifDoubleDot) {
        el.value = valueWithoutLast;
      }
    });
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
