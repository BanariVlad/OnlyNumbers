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
      let firstDot = lastIntroduced === "." && formattedValue.length !== 1 && !hasDot;
      let zeroAfterDot = lastIntroduced === "0" && hasDot;
      let zeroAfterZero = lastIntroduced === "0" && valueWithoutLast[valueWithoutLast.length - 1] === "."
        || lastIntroduced === "0" && valueWithoutLast[valueWithoutLast.length - 1] === "0";
      let notDoubleDot = hasDot && !formattedValue.includes(".");
      let notSpaceOrDot = lastIntroduced === " " || lastIntroduced === ".";
      let antiDotOrSpace = isNaN(lastIntroduced) && lastIntroduced !== ".";

      if (ifMinus) {
        el.value = lastIntroduced;
      } else if (notDoubleDot) {
        el.value = valueWithoutLast;
        hasDot = false;
      } else if (firstDot || zeroAfterDot || zeroAfterZero) {
        el.value = formattedValue;
        hasDot = true;
      } else if (notSpaceOrDot || antiDotOrSpace) {
        el.value = valueWithoutLast;
      } else {
        const result = parseFloat(formattedValue);
        el.value = isNaN(result) ? "" : parseFloat(formattedValue);
      }
    });
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
