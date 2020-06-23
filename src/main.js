import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind(el) {
    let newValue;
    let oldValue;
    let lastIntroduced;
    let mainValue;

    el.addEventListener("keydown", event => {
      mainValue = event.target.value;
      let lastValue = event.key;
      let zeroAndMinusValidation = validZeroAndMinus(lastValue);
      lastIntroduced = lastValue;
      oldValue = mainValue;

      if (validFirstSymbols(lastValue) && lastValue !== "Backspace") {
        return event.preventDefault();
      }

      if (zeroAndMinusValidation && lastValue === "-") {
        event.target.value = "-";
        return event.preventDefault();
      }

      if (zeroAndMinusValidation && lastValue === ".") {
        event.target.value = "0.";
        return event.preventDefault();
      }

      if (validDotAfterMinus(lastValue)) {
        event.target.value = "-0.";
        return event.preventDefault();
      }

      if (validInput(lastValue) || lastValue === " ") {
        return event.preventDefault();
      }

      if (validDot(lastValue)) {
        return event.preventDefault();
      }
    });

    el.addEventListener("change", event => {
      let lastValue = mainValue[mainValue.length - 1];

      if (mainValue === "-0" || mainValue === "-0.") {
        event.target._value = "";
      } else if (lastValue === "." || lastValue === "-") {
        event.target._value = mainValue.slice(0, -1);
      }
    });

    el.addEventListener("input", event => {
      newValue = event.target.value;

      if (validMinus(lastIntroduced)) {
        event.target.value = oldValue;
      }

      if (oldValue.includes("-") && lastIntroduced === "-") {
        event.target.value = oldValue;
      }

      if (validDotDeleting(oldValue, newValue) && mainValue[0] === "0") {
        event.target.value = mainValue.slice(2, mainValue.length);
      }

      if (
        validDotDeleting(oldValue, newValue) &&
        mainValue[0] === "-" &&
        mainValue[1] === "0"
      ) {
        event.target.value =
          mainValue.slice(0, 1) + mainValue.slice(3, mainValue.length);
      }

      if (newValue[0] === ".") {
        event.target.value = oldValue;
      }
    });

    const validDotDeleting = (oldValue, newValue) => {
      return oldValue.includes(".") && !newValue.includes(".");
    };

    const validFirstSymbols = value => {
      return value !== "." && (mainValue === "0" || mainValue === "-0");
    };

    const validZeroAndMinus = value => {
      return (
        (value === "." && mainValue === "") ||
        (value === "-" && mainValue === "")
      );
    };

    const validDotAfterMinus = value => {
      return value === "." && mainValue === "-";
    };

    const validInput = value => {
      return (
        isNaN(Number(value)) &&
        value !== "." &&
        value !== "-" &&
        value !== "Backspace" &&
        value !== "Delete" &&
        value !== "ArrowLeft" &&
        value !== "ArrowRight" &&
        value !== "ArrowDown" &&
        value !== "ArrowUp"
      );
    };

    const validDot = value => {
      return value === "." && mainValue.includes(".");
    };

    const validMinus = value => {
      return value === "-" && newValue.indexOf("-") > 0;
    };
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
