import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind(el) {
    let hasDot = false;
    let hasMinus = false;

    el.addEventListener("input", (event) => {
      let formattedValue = event.target.value;
      let lastIntroduced = formattedValue[formattedValue.length - 1];
      let valueWithoutLast = formattedValue.slice(0, -1);
      let ifMinus = el.value.length === 1 && lastIntroduced === "-";
      let ifFirstDot = formattedValue.length === 1 && lastIntroduced === ".";
      let ifDotAfterMinus = lastIntroduced === "." && formattedValue.length === 2 && hasMinus;

      if (!formattedValue.includes(".")) {
        hasDot = false;
      } else if (ifMinus) {
        el.value = lastIntroduced;
        hasMinus = true;
      } else if (ifFirstDot || ifDotAfterMinus) {
        el.value = valueWithoutLast;
      } else if (lastIntroduced === "." && !hasDot) {
        el.value = formattedValue;
        hasDot = true;
      } else if (isNaN(lastIntroduced) || lastIntroduced === " ") {
        el.value = valueWithoutLast;
      }
    });
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
