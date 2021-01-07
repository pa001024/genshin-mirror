import { assign } from "lodash-es";
import Vue from "vue";
import VueI18n from "vue-i18n";

import vuetifyEn from "vuetify/src/locale/en";
import vuetifyZhHans from "vuetify/src/locale/zh-Hans";
import vuetifyZhHant from "vuetify/src/locale/zh-Hant";
import langEn from "../locales/en-US.json";

Vue.use(VueI18n);

const cnDF = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  weekday: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  },
  long: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  },
  time: {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  },
};

const dateTimeFormats = {
  en: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    weekday: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    },
    time: {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    },
  },
  "zh-CN": cnDF,
  "zh-CY": cnDF,
  "zh-TW": cnDF,
  "zh-HK": cnDF,
  "zh-SG": cnDF,
  "zh-MO": cnDF,
};

// 配置
const en = assign(vuetifyEn, langEn);

export const vi18n = new VueI18n({
  dateTimeFormats,
  locale: "en",
  fallbackLocale: "en",
  messages: { en },
});

export async function changeLocale(locale: string) {
  if (vi18n.locale !== locale) {
    console.log("Change locale to", locale || "(default)" + navigator.language);
    if (locale) {
      vi18n.locale = locale;
      localStorage.setItem("lang", locale);
    } else {
      locale = vi18n.locale = navigator.language;
      localStorage.removeItem("lang");
    }
  }
  switch (locale) {
    case "zh-CN":
    case "zh-SG": {
      const { default: zh } = await import(/* webpackChunkName: "lang-zh-Hans" */ "../i18n/locales/zh-Hans.json");
      const chs = assign(vuetifyZhHans, zh);
      vi18n.setLocaleMessage(locale, chs);
      break;
    }
    case "zh-TW":
    case "zh-HK":
    case "zh-MO": {
      const { default: zhTW } = await import(/* webpackChunkName: "lang-zh-Hant" */ "../i18n/locales/zh-Hant.json");
      const cht = assign(vuetifyZhHant, zhTW);
      vi18n.setLocaleMessage(locale, cht);
      break;
    }
    default:
  }
  document.title = vi18n.t("title.main").toString();
}
