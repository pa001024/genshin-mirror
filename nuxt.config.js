import colors from "vuetify/es5/util/colors";

export default {
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
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // vuex-persist
    { src: "~/plugins/vuex-persist", ssr: false },
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
  ],
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
      onlyOnRoot: true, // recommended
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
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        light: {
          primary: colors.indigo,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Enable thread-loader in webpack building
    parallel: true,

    extend(_config, { isClient, loaders }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        _config.node = {
          fs: "empty",
        };
        // config.devtool = "source-map";
        loaders.protobuf = {
          use: "protobuf-preloader",
          options: {
            /* controls the "target" flag to pbjs - true for
             * json-module, false for static-module.
             * default: false
             */
            json: false,

            /* import paths provided to pbjs.
             * default: webpack import paths (i.e. config.resolve.modules)
             */
            paths: ["@/proto"],

            /* additional command line arguments passed to
             * pbjs, see https://github.com/dcodeIO/ProtoBuf.js/#pbjs-for-javascript
             * for a list of what's available.
             * default: []
             */
            pbjsArgs: [
              // "--no-encode"
            ],
          },
        };
      }
    },
  },
};
