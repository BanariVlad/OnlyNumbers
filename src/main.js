import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind(el) {
    let hasDot = false;

    el.addEventListener("input" , (event) => {
      let formattedValue = event.target.value;
      let lastIntroduced = formattedValue[formattedValue.length - 1];
      let valueWithoutLast = formattedValue.slice (0, -1);

      if (el.value.length === 1 && lastIntroduced === "-") {
        el.value = lastIntroduced;
      } else if (hasDot && !formattedValue.includes(".")) {
        el.value = valueWithoutLast;
        hasDot = false;
      } else if (lastIntroduced === "." && formattedValue.length !== 1 && !hasDot) {
        el.value = formattedValue;
        hasDot = true;
      } else if (lastIntroduced === " " || lastIntroduced === ".") {
        el.value = valueWithoutLast;
      } else if (isNaN(lastIntroduced) && lastIntroduced !== ".") {
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
