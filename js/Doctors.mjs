import { renderListWithTemplate, getParam } from "./utils.mjs";

const parentListElement = document.getElementById("parent-list");

function doctorListCardTemplate(doctor) {
    const age = calculateAge(doctor.birthDate);
    return `
      <li class='doctor-list-card'>
        <img src='${doctor.image}' alt='Image of ${doctor.name}' />
        <h2 class='card__brand'>${doctor.name}</h2>
        <p>Age: ${age}</p>
        <p>⭐ ${doctor.rating} <span>(${doctor.consultations} consultations)</span></p>
        <button class="appointment-btn" data-id="${doctor.id}">Make Appointment</button>
        <a href="../doctor-pages/index.html?id=${doctor.id}" class="see-profile-btn">See Profile</a>
      </li>`;
}

async function getListByCategory(category) {
    const response = await fetch("../json/doctors.json");
    const data = await response.json();
    return data.filter(doc => doc.category === category);
}

const parentDoctorElement = document.getElementById("doctor-details");

function doctorsDetailsTemplate(doctor) {
    return `
    <section class="doctor-profile">
        <div class="doctor-header">
            <img class="doctor-profile-img" src="${doctor.image}" alt="${doctor.name}" />
            <div class="doctor-header-info">
                <h1 class="doctor-name">${doctor.name}</h1>
                <p class="doctor-specialty">${doctor.category}</p>
                <p class="doctor-age">Age: ${calculateAge(doctor.birthDate)}</p>
                <p class="doctor-rating">⭐ ${doctor.rating} (${doctor.consultations} consultations)</p>
            </div>
        </div>
        
        <div class="doctor-bio">
            <h2>Biography</h2>
            <p>${doctor.bio}</p>
        </div>
        
        <div class="doctor-consultation">
            <button id="bookAppointment" data-id="${doctor.id}" class="appointment-btn">Book Consultation</button>
        </div>
        
        <div class="doctor-contact">
            <h3>Contact Information</h3>
            <p>Phone: ${doctor.phone}</p>
            <p>Email: <a href="mailto:${doctor.email}">${doctor.email}</a></p>
        </div>
    </section>`;
}

async function getDoctorById(id) {
    const response = await fetch("../json/doctors.json");
    const data = await response.json();
    return data.find(doc => doc.id === id);
}

function calculateAge(birthDateStr) {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
        age--; // birthday hasn't occurred yet this year
    }
    return age;
}

export default class Doctors {
    constructor() { }

    async renderDoctorsByCategory() {
        const category = getParam("category");
        const list = await getListByCategory(category);
        renderListWithTemplate(doctorListCardTemplate, parentListElement, list);
        this.insertHeading(category);
    }

    async renderDoctorById() {
        const id = getParam("id");
        const doctor = await getDoctorById(id);
        const template = doctorsDetailsTemplate(doctor);
        parentDoctorElement.innerHTML = template;
    }

    insertHeading(category) {
        const section = document.querySelector("section");
        const heading = document.createElement("h2");
        heading.textContent = category.toUpperCase();
        heading.classList.add("category-heading");
        section.prepend(heading);
    }

}
