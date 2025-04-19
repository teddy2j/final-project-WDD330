const CLIENT_ID = "819218632459-b5b9am8k686o3rh2lh75gm9r1v9himpu.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let accessToken = null;

/** Load the Calendar API */
export function initGapi() {
    return new Promise(resolve => {
        gapi.load("client", async () => {
            await gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
            });
            resolve();
        });
    });
}

/** Prepare the GIS token client */
export function initGis() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: resp => {
            if (resp.error) {
                console.error("Token error", resp);
                return;
            }
            accessToken = resp.access_token;
        }
    });
}

/** Sign in (or reuse existing token) */
export function signInWithGoogle() {
    return new Promise(resolve => {
        if (!accessToken) {
            tokenClient.callback = resp => {
                if (resp.error) throw resp;
                accessToken = resp.access_token;
                resolve();
            };
            tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
            resolve();
        }
    });
}

/** Inserts a 30‑minute event for the given doctor */
export function createCalendarEvent(doctor) {
    const start = new Date(),
        end = new Date(start.getTime() + 30 * 60000);

    const event = {
        summary: `Consultation with Dr. ${doctor.name}`,
        description: `Specialty: ${doctor.category}\n${doctor.bio}`,
        start: { dateTime: start.toISOString(), timeZone: "UTC" },
        end: { dateTime: end.toISOString(), timeZone: "UTC" }
    };

    return gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event
    }).then(() => {
        alert("✅ Appointment booked in your Google Calendar!");
    }).catch(err => {
        console.error(err);
        alert("❌ Failed to create event.");
    });
}

// initialize GIS immediately
initGis();

export function initMap() {
    const center = { lat: 40.7128, lng: -74.0060 }; // Change to your location if you want

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: center,
    });

    new google.maps.Marker({
        position: center,
        map: map,
        title: "Online Medical Center",
    });
}