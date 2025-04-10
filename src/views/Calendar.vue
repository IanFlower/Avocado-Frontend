<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { VCalendar } from 'vuetify/labs/VCalendar'
import EventService from '../services/eventServices';

const allEvents = ref([])
const router = useRouter();

  const goHome = () => {
    router.push('/home'); 
  };

  onMounted(() => {
    initialize();
  })

  async function initialize() {
  const csEvents = await EventService.getAllEvents()

  csEvents.data.forEach((e) => {
    allEvents.value.push({
      title: e.name,
      start: new Date(e.startDateTime),
      end: new Date(e.endDateTime),
      color: "deep-purple",
      allDay: false,
    })
  })

    
  const request = {
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime',
  };
  let response = await gapi.client.calendar.events.list(request);
}

      // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '<YOUR_CLIENT_ID>';
      const API_KEY = '<YOUR_API_KEY>';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }
  
  

</script>

<template>
<v-div>
  <v-calendar
  :events="allEvents" 
  class="ma-4"/>
</v-div>

</template>