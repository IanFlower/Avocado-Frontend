<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { VCalendar } from 'vuetify/labs/VCalendar';
import EventService from '../services/eventServices';

const allEvents = ref([]);
const calEvents = [];
const router = useRouter();
const buttonDialog = ref(true)

const goHome = () => {
  router.push('/home'); 
};

let tokenClient;

async function initialize() {
  // Load GAPI
  await new Promise(resolve => gapi.load('client', resolve));

  // Init GAPI client
  await gapi.client.init({
    apiKey: import.meta.env.VITE_API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  });

  // Init token client (but DO NOT call it yet)
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_APP_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    callback: async (tokenResponse) => {
      gapi.client.setToken(tokenResponse);
      await loadAndListEvents(); // Load calendar + your events after auth
    },
  });

  // Load custom backend events
  const csEvents = await EventService.getAllEvents();
  csEvents.data.forEach((e) => {
    allEvents.value.push({
      title: e.name,
      start: new Date(e.startDateTime),
      end: new Date(e.endDateTime),
      color: "deep-purple",
      allDay: false,
      class: "calendar-event"
    });
  });
}

// Triggered by user action (click)
const handleLogin = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  }
  closeDialog()
};

async function loadAndListEvents() {
  await gapi.client.load("calendar", "v3");
  console.log("GAPI Calendar client loaded");

  const calEvents = [];

  try {
    // Get all calendars
    const calendarListRes = await gapi.client.calendar.calendarList.list();
    const calendars = calendarListRes.result.items;

    for (const calendar of calendars) {
      console.log('Fetching events for calendar:', calendar.summary, '| ID:', calendar.id);

      let pageToken = null;
      do {
        try {
          const eventsRes = await gapi.client.calendar.events.list({
            calendarId: calendar.id,
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 2500, // Max allowed
            pageToken: pageToken,
          });

          const events = eventsRes.result.items || [];
          events.forEach(event => {
            calEvents.push({
              ...event,
              calendarSummary: calendar.summary,
            });
          });

          pageToken = eventsRes.result.nextPageToken;
        } catch (eventErr) {
          console.error(`Failed to fetch events for calendar ${calendar.summary}:`, eventErr);
          break;
        }
      } while (pageToken);
    }

    console.log('✅ All Upcoming Events:', calEvents);

  } catch (err) {
    console.error('❌ Error fetching calendar list:', err);
  }

  // Format for your calendar view
  calEvents.forEach((e) => {
    allEvents.value.push({
      title: e.summary,
      start: new Date(e.start?.dateTime || e.start?.date),
      end: new Date(e.end?.dateTime || e.end?.date),
      color: "blue",
      allDay: !e.start?.dateTime, // all-day if there's no specific time
    });
  });
}

const closeDialog = () => {
  buttonDialog.value = false;
};


onMounted(() => {
  initialize();
});
</script>


<template>
<v-div>
  <v-calendar
  :events="allEvents" 
  class="ma-4"/>
  <v-dialog width="500px" v-model="buttonDialog">
    <v-card>
      <v-card-title>Would you like to login to your Google Calendar?</v-card-title>
      <v-card-actions>
          <v-btn class="secondary-button" text @click="closeDialog()">No</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleLogin()">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-div>

</template>

<style> 
.calendar-event {
  margin: 2px;
  font-weight: bold;
}
</style>