import { renderListWithTemplate, getParam } from "./utils.mjs";

const parentListElement = document.getElementById("parent-list");

function doctorListCardTemplate(doctor) {
    return `
    <li class='doctor-list-card'>
        <a href='/src/doctor-pages/index.html?id=${doctor.id}'>
            <img src='${doctor.image}' alt='Image of ${doctor.name}' />
            <h2 class='card__brand'>${doctor.name}</h2>
        </a>
        <button id="quickAddToCart" data-id="${doctor.id}">Add to Cart</button>
    </li>`;
}

async function getListByCategory(category) {
    const response = await fetch("/src/json/doctors.json");
    const data = await response.json();
    return data.filter(doc => doc.category === category);
}

const parentDoctorElement = document.getElementById("doctor-details");

function doctorsDetailsTemplate(doctor) {
    return `
    <section class="product-detail"> <h3>${doctor.name}</h3>
        <h2 class="divider">${doctor.name}</h2>
        <img
          class="divider"
          src="${doctor.image}"
          alt="${doctor.name}"
        />
        <div class="product-detail__add">
          <button id="addToCart" data-id="${doctor.id}">Add to Cart</button>
        </div></section>`;
}

async function getDoctorById(id) {
    const response = await fetch("/src/json/doctors.json");
    const data = await response.json();
    return data.find(doc => doc.id === id);
}


export default class Doctors {
    constructor() {

    }
    async renderDoctorsByCategory() {
        const category = getParam("category");
        const list = await getListByCategory(category);
        console.log(list);
        renderListWithTemplate(doctorListCardTemplate, parentListElement, list);
    }
    async renderDoctorById() {
        const id = getParam("id");
        const doctor = await getDoctorById(id);
        const template = doctorsDetailsTemplate(doctor);
        parentDoctorElement.innerHTML = template;
    }

}