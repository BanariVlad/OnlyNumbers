import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind(el) {
    let newValue;
    let oldValue;
    let lastIntroduced;

    el.addEventListener("keydown", event => {
      let lastValue = event.key;
      lastIntroduced = lastValue;
      let zeroAndMinusValidation = validZeroAndMinus(lastValue);
      oldValue = el.value;

      if (validFirstSymbols(lastValue) && lastValue !== "Backspace") {
        return event.preventDefault();
      }

      if (zeroAndMinusValidation && lastValue === "-") {
        el.value = "-";
        return event.preventDefault();
      }

      if (zeroAndMinusValidation && lastValue === ".") {
        el.value = "0.";
        return event.preventDefault();
      }

      if (validDotAfterMinus(lastValue)) {
        el.value = "-0.";
        return event.preventDefault();
      }

      if (validInput(lastValue) || lastValue === " ") {
        return event.preventDefault();
      }

      if (validDot(lastValue)) {
        return event.preventDefault();
      }
    });

    el.addEventListener("blur", () => {
      let lastValue = el.value[el.value.length - 1];

      if (el.value === "-0" || el.value === "-0.") {
        el.value = "";
      } else if (lastValue === "." || lastValue === "-") {
        el.value = el.value.slice(0, -1);
      }
    });

    el.addEventListener("input", event => {
      newValue = event.target.value;
      console.log(oldValue);

      if (validMinus(lastIntroduced)) {
        el.value = oldValue;
      }

      if (oldValue.includes("-") && lastIntroduced === "-") {
        el.value = oldValue;
      }

      if (validDotDeleting(oldValue, newValue) && el.value[0] === "0") {
        el.value = el.value.slice(1, el.value.length);
      }

      if (
        validDotDeleting(oldValue, newValue) &&
        el.value[0] === "-" &&
        el.value[1] === "0"
      ) {
        el.value = el.value.slice(0, 1) + el.value.slice(2, el.value.length);
      }

      if (newValue[0] === ".") {
        el.value = oldValue;
      }
    });

    const validDotDeleting = (oldValue, newValue) => {
      return oldValue.includes(".") && !newValue.includes(".");
    };

    const validFirstSymbols = value => {
      return (
        (el.value === "0" && value !== ".") ||
        (el.value === "-0" && value !== ".")
      );
    };

    const validZeroAndMinus = value => {
      return (
        (value === "." && el.value === "") || (value === "-" && el.value === "")
      );
    };

    const validDotAfterMinus = value => {
      return value === "." && el.value === "-";
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
      return value === "." && el.value.includes(".");
    };

    const validMinus = value => {
      return value === "-" && newValue.indexOf("-") > 0;
    };
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
