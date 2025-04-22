/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";

// Misc
import { loadFonts } from "./webfontloader";
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  background: "#ffffff",
  colors: {
    primary: "#80162B",
    secondary: "#D5DFE7",
    accent: "#F9C634",
    success: "#47121D",
    error: "#EE5044",
    tertiary: "#004761",
    alt: "#004761",
    tHead: "#D5DFE7",
  },
};

const myCustomDarkTheme = {
  dark: true,
  background: "#292929",
  colors: {
    background: "#292929",
    text: "#ffffff",
    primary: "#1A1A1A",
    secondary: "#3A3A3A",
    accent: "#f9c434ad",
    success: "#47121D",
    error: "#EE5044",
    tertiary: "#004761",
    alt: "#004761",
    tHead: "#004761",
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
