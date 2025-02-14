<script setup>
let isDark = false;
document.documentElement.setAttribute('data-theme', 'light');
</script>
<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'></link>
<style>
/* OC Red */
.primary{
    color: white !important;
    background-color: var(--primary) !important;
}

/* OC Silver */
.secondary{
    color: black !important;
    background-color: var(--secondary) !important;
}

/* OC Gold */
.accent{
    color: black !important;
    background-color: var(--accent) !important;
}

/*For main buttons on a page ex: continue*/
.primary-button {
  background-color: var(--primary) !important;
  color: white !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
/*For secoundary buttons on a page ex: cancel*/
.secondary-button {
  background-color: var(--secondary) !important;
  color: black !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}

/*For warning buttons on a page ex: delete*/
.warning-button {
  background-color: red !important;
  color: white !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
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

.primary:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}
.secondary:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}
.accent:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}
tbody tr:nth-of-type(even) {
    background-color: var(--secondary) !important;
}

tbody tr:nth-of-type(odd) {
    background-color: white !important;
}

html *
{
    font-family: 'Inter' !important;
}

</style>