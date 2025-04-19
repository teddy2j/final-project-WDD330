import { formDataToJSON } from "/js/CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, removeAllAlerts, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
const services = new ExternalServices();

async function signUp() {
    const formElement = document.forms["sign-up"];
    const json = formDataToJSON(formElement);
    console.log(json);
    try {
        const res = await services.signUp(json);
        console.log(res);
        location.assign("/checkout/success.html");
    } catch (err) {
        // get rid of any preexisting alerts.
        removeAllAlerts();
        for (let message in err.message) {
            alertMessage(err.message[message]);
        }
        console.log(err);
    }
}

function addListener() {
    document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
        e.preventDefault();
        const form = document.forms[0];
        const checkStatus = form.checkValidity();
        form.reportValidity();
        if (checkStatus) {
            signUp();
        }
    });
}

addListener();


