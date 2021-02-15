import { NuxtConfig } from "@nuxt/types";
import colors from "vuetify/es5/util/colors";

require("dotenv").config();

const config: NuxtConfig = {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s",
    title: "Genshin Mirror",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    // HMT
    script: process.env.NODE_ENV === "production" ? [{ src: "https://hm.baidu.com/hm.js?543c5e05f8df5c5dadd8b355c3ee8d16", defer: true, body: true }] : [],
  },

  // Automatically generate or serve dynamic sitemap.xml (https://www.npmjs.com/package/@nuxtjs/sitemap)
  sitemap: {},

  ignore: ["**/*.test.*", "**/*.spec.*"],

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/global.less"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // vuex-persist
    { src: "~/plugins/vuex-persist", ssr: false },
    { src: "~/plugins/vue-class-component", ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",

    [
      "@nuxtjs/localforage",
      {
        /* module options */
        name: "gsMirror",
        storeName: "gsMirrorLocal",
      },
    ],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    // https://go.nuxtjs.dev/content
    "@nuxt/content",
    // https://i18n.nuxtjs.org/
    "nuxt-i18n",
    // https://www.npmjs.com/package/@nuxtjs/apollo
    "@nuxtjs/apollo",
    // https://www.npmjs.com/package/@nuxtjs/sitemap
    "@nuxtjs/sitemap",
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.BASE_URL + "/graphql",
        browserHttpEndpoint: "/graphql",
        tokenName: "apollo-token",
        inMemoryCacheOptions: {
          // typePolicies: {
          //   userCharacters: {
          //     keyFields: ["avatarId", "owner"],
          //   },
          // },
        },
      } as any,
    },

    // setup a global error handler (see below for example)
    errorHandler: "~/plugins/apollo-error-handler.ts",

    // Sets the authentication type for any authorized request.
    authenticationType: "Bearer",

    // Token name for the cookie which will be set in case of authentication
    tokenName: "apollo-token",

    // Cookie parameters used to store authentication token
    cookieAttributes: {
      /**
       * Define when the cookie will be removed. Value can be a Number
       * which will be interpreted as days from time of creation or a
       * Date instance. If omitted, the cookie becomes a session cookie.
       */
      expires: 15,

      /**
       * Define the path where the cookie is available. Defaults to '/'
       */
      path: "/",

      /**
       * Define the domain where the cookie is available. Defaults to
       * the domain of the page where the cookie was created.
       */
      domain: new URL(process.env.BASE_URL!).hostname,

      /**
       * A Boolean indicating if the cookie transmission requires a
       * secure protocol (https). Defaults to false.
       */
      secure: process.env.NODE_ENV === "production",
    },
  },

  pwa: {
    icon: {
      source: "~/static/icon.png",
    },
  },

  // i18n config
  i18n: {
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: {
        "zh-Hans": ["zh", "zh-CN", "zh-SG"],
        // "zh-Hant": ["zh-TW", "zh-HK", "zh-MO"],
        default: ["en"],
      },
    },
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      onlyOnRoot: true,
    },
    lazy: true,
    langDir: "locales/",
    locales: [
      // ** ADD YOUR LOCALE FILE HERE **
      {
        code: "en",
        file: "en.json",
        name: "English",
      },
      {
        code: "zh-Hans",
        file: "zh-Hans.json",
        name: "简体中文",
      },
      {
        code: "zh-Hant",
        file: "zh-Hant.json",
        name: "繁體中文",
      },
      {
        code: "ja",
        file: "ja.json",
        name: "日本語",
      },
    ],
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL,
    browserBaseURL: "/api",
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    // customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      default: "dark",
      disable: false,
      options: {},
      themes: {
        light: {
          primary: colors.indigo.base,
          accent: colors.shades.black,
          secondary: colors.grey.darken1,
          error: colors.red.accent3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          success: colors.green.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          error: colors.deepOrange.accent4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          success: colors.green.accent3,
        },
      },
    },
  },

  server: {
    host: "127.0.0.1",
    port: 7333,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: {
      ignoreOrder: true,
    },
    // extract everything into a single file
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.vue$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
  },
};

export default config;
