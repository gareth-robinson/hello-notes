import React from "react";
import ReactDOM from "react-dom";
import App from "./js/app";
import { IntlProvider } from "react-intl";
import css from "./css/style.css";
import "react-quill/dist/quill.snow.css";

const availableLocales = ["en", "ne"];
const possibleLocale = navigator.language.split("-")[0];
const locale = availableLocales.includes(possibleLocale)
  ? possibleLocale
  : "en";

(async () => {
  const localeData = await import(`./js/i18n/${locale}`);
  ReactDOM.render(
    <IntlProvider locale={locale} messages={localeData}>
      <App />
    </IntlProvider>,
    document.getElementById("app")
  );
})();
