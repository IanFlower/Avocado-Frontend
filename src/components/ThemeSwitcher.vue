<script setup>
import { useTheme } from 'vuetify'
import { inject, watch, onMounted } from "vue";
const isDark = inject('isDark')
const theme = useTheme()

watch(() => isDark.value, () => {
    
    toggleTheme()
});
onMounted(() => {
    try {
        toggleTheme()
    }
    catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
        theme.global.name.value = 'myCustomLightTheme'
    }
});

function toggleTheme () {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  theme.global.name.value = isDark.value
    ? 'myCustomDarkTheme'
    : 'myCustomLightTheme'
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
    rel="stylesheet">
</link>
<style>
/* OC Red */
.primary {
    color: white !important;
    background-color: var(--primary) !important;
}
/* OC Silver */
.secondary {
    color: var(--text-color) !important;
    background-color: var(--secondary) !important;
}

/* OC Blue */
.tertiary {
    color: white !important;
    background-color: var(--tertiary) !important;
}

/* OC Gold */
.accent {
    color: black !important;
    background-color: var(--accent) !important;
}

.v-data-table thead {
    background-color: var(--t-head) !important;
}

/*For main buttons on a page ex: continue*/
.primary-button {
    background-color: var(--primary) !important;
    color: white !important;
    transition: background-color 0.3s ease, color 0.3s ease !important;
}

/*For secondary buttons on a page ex: cancel*/
.secondary-button {
    background-color: var(--secondary) !important;
    color: var(--text-color) !important;
    transition: background-color 0.3s ease, color 0.3s ease !important;
}

.accent-button {
    background-color: var(--accent) !important;
    transition: background-color 0.3s ease, color 0.3s ease !important;
}

/*For tertiary buttons on a page ex: add*/
.tertiary-button {
    background-color: var(--tertiary) !important;
    color: white !important;
    transition: background-color 0.3s ease, color 0.3s ease !important;
}

/*For warning buttons on a page ex: delete*/
.warning-button {
    background-color: red !important;
    color: white !important;
    transition: background-color 0.3s ease, color 0.3s ease !important;
}

.tertiary-switch {
    color: var(--tertiary) !important;
}

.alt-button {
    background-color: var(--alt) !important;
    color: white !important;
}

/*Done use these they are automatically applied to buttons and colors  */
.primary-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.secondary-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.warning-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.primary:focus {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.secondary:focus {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.accent:focus {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.tertiary:focus {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.v-application {
  background-color: var(--background-color) !important;
}

/* tbody tr:nth-of-type(even) {
    background-color: var(--secondary) !important;
}

tbody tr:nth-of-type(odd) {
    background-color: white !important;
} */
.v-data-table thead {
    background-color: #D5DFE7;
}

.merriweather-font {
    font-family: "Merriweather", serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
    font-variation-settings:
        "wdth" 100;
}

.bebas-neue-regular {
    font-family: "Bebas Neue", sans-serif;
    font-weight: 400;
    font-style: normal;
}

.v-application {
    background-color: var(--background-color) !important;
}

.v-card {
  box-shadow: none !important;
  border: none !important;
}

.v-list {
  background: transparent !important;
}

.v-card:not(:last-child) {
  margin-bottom: 1rem; /* Or use gap on parent if possible */
}

</style>