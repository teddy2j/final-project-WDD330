import Doctors from "./doctors.mjs";
import { initGapi, signInWithGoogle, createCalendarEvent } from "./externalApi.mjs";

const doctors = new Doctors();

doctors.renderDoctorById().then(() => {
    // Wait for the DOM to be updated with the doctor details
    const bookBtn = document.getElementById("bookAppointment");

    if (bookBtn) {
        bookBtn.addEventListener("click", async () => {
            try {
                bookBtn.disabled = true;
                bookBtn.textContent = "Booking...";

                const doctorId = bookBtn.dataset.id;

                // Fetch doctor again (simple and safe here since we know the ID)
                const response = await fetch("../json/doctors.json");
                const data = await response.json();
                const doctor = data.find(doc => doc.id === doctorId);

                if (!doctor) {
                    alert("❌ Doctor not found.");
                    return;
                }

                await initGapi();
                await signInWithGoogle();
                await createCalendarEvent(doctor);

                bookBtn.textContent = "Booked!";
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert("❌ Failed to book the appointment.");
                bookBtn.textContent = "Try Again";
            } finally {
                bookBtn.disabled = false;
            }
        });
    }
});
