<script setup>
let isDark = false;
document.documentElement.setAttribute('data-theme', 'light');
</script>
<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'></link>
<style>
.primary{
    color: var(--primary) !important;
    background-color: var(--primary) !important;
}
.primary:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.secoundary{
    color: var(--secondary) !important;
    background-color: var(--secondary) !important;
}
.secoundary:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.accent{
    color: var(--accent) !important;
    background-color: var(--accent) !important;
}
.accent:focus{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.primary-button {
  background-color: var(--primary) !important;
  color: white !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
.primary-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}
.secondary-button {
  background-color: var(--secondary) !important;
  color: black !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
.secondary-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}
.warning-button {
  background-color: red !important;
  color: white !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
.warning-button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

html *
{
    font-family: 'Inter' !important;
}

</style>