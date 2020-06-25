import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.directive("only-numbers", {
  bind: function(el, binding, vNode) {
    let newValue = "";
    let oldValue = "";
    let lastIntroduced = "";
    let mainValue = "";

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

    el.addEventListener("input", event => {
      newValue = event.target.value;

      if (validZero(lastIntroduced)) {
        event.target.value = oldValue;
      }

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
        event.target.value = "0." + oldValue;
      }

      if (newValue[0] === "-" && newValue[1] === ".") {
        event.target.value = "-0." + oldValue.slice(1, oldValue.length);
      }

      if (validBeforeMinus()) {
        event.target.value = oldValue;
      }

      if (validDeletingBeforeDot()) {
        event.target.value = "0" + oldValue.slice(1, oldValue.length);
      }

      if (validDeletingWithMinus()) {
        event.target.value = oldValue.slice(1, oldValue.length);
      }

      if (validNumbersAfterZero() && lastIntroduced !== "Backspace") {
        event.target.value = oldValue;
      }
    });

    vNode.componentInstance.$on("blur", event => {
      let value = event.target.value;
      let formattedValue = blurValidValue(newValue);

      if (blurValidTermination(value)) {
        vNode.componentInstance.$data.lazyValue = formattedValue;
      }

      if (blurValidDotAndMinus() || blurValidZero()) {
        vNode.componentInstance.$data.lazyValue = formattedValue;
      }

      if (blurValidDeleting(value) || formattedValue === "-") {
        vNode.componentInstance.$data.lazyValue = "";
      }

      if (checkBlurMinusValidation(newValue)) {
        vNode.componentInstance.$data.lazyValue = blurValidMinus(newValue);
      } else if (secondBlurMinusValidation(newValue)) {
        vNode.componentInstance.$data.lazyValue =
          "-" + validSecondMinus(newValue);
      }

      if (validNumbersAfterZero() || blurValidBeforeMinus(newValue)) {
        vNode.componentInstance.$data.lazyValue = oldValue;
      }
    });

    const validDotDeleting = (oldValue, newValue) => {
      return oldValue.includes(".") && !newValue.includes(".");
    };

    const validFirstSymbols = value => {
      return value !== "." && (mainValue === "0" || mainValue === "-0");
    };

    const validZeroAndMinus = value => {
      return mainValue === "" && (value === "." || value === "-");
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

    const validZero = value => {
      return (
        value === "0" &&
        oldValue[0] !== "0" &&
        ((newValue[0] === "0" && newValue !== "0") ||
          (newValue[0] === "-" && newValue[1] === "0" && newValue !== "-0"))
      );
    };

    const validBeforeMinus = () => {
      return (
        oldValue[0] === "-" && newValue[0] !== "-" && newValue.includes("-")
      );
    };

    const validDeletingBeforeDot = () => {
      return (
        newValue[0] === "." &&
        newValue[0] !== oldValue[0] &&
        oldValue[1] === "."
      );
    };

    const validDeletingWithMinus = () => {
      return (
        oldValue[0] === "-" && newValue[1] === "." && oldValue.includes(".")
      );
    };

    const validNumbersAfterZero = () => {
      return (
        (newValue[0] === "0" && oldValue[1] === "." && newValue[1] !== ".") ||
        (newValue[0] === "-" &&
          newValue[1] === "0" &&
          newValue[2] !== "." &&
          oldValue[2] === ".")
      );
    };

    const blurValidTermination = value => {
      return value[value.length - 1] === "." || value[value.length - 1] === "-";
    };

    const blurValidDotAndMinus = () => {
      return (
        (newValue[0] === "-" && newValue[1] === "-") ||
        (newValue[0] === "." && oldValue[0] !== ".") ||
        (newValue[1] === "." && oldValue[1] !== "." && newValue[0] === "-")
      );
    };

    const blurValidZero = () => {
      return (
        (newValue[0] === "0" && oldValue[0] !== "0") ||
        (newValue[1] === "0" && oldValue[1] !== "0")
      );
    };

    const blurValidDeleting = value => {
      return value === "-0" || value === "0." || value === "-0.";
    };

    const blurValidValue = value => {
      if (value[value.length - 1] === "-" && value[value.length - 2] === ".") {
        return value.slice(0, value.length - 2);
      } else if (
        value[value.length - 1] === "." ||
        value[value.length - 1] === "-"
      ) {
        return value.slice(0, -1);
      } else {
        return value;
      }
    };

    const checkBlurMinusValidation = value => {
      return value.includes("-") && value.indexOf("-") !== 0;
    };

    const secondBlurMinusValidation = value => {
      return value[0] === "-" && value.slice(1, value.length).includes("-");
    };

    const blurValidMinus = value => {
      return (
        value.slice(0, value.indexOf("-")) +
        value.slice(value.indexOf("-") + 1, value.length)
      );
    };

    const validSecondMinus = value => {
      let valueWithoutMinus = value.slice(1, value.length);
      return (
        valueWithoutMinus.slice(0, valueWithoutMinus.indexOf("-")) +
        valueWithoutMinus.slice(
          valueWithoutMinus.indexOf("-") + 1,
          valueWithoutMinus.length
        )
      );
    };

    const blurValidBeforeMinus = value => {
      return value[0] !== "-" && value[1] === "-";
    };
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
