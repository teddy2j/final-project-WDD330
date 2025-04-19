function addListener() {
    document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
        e.preventDefault();
        const form = document.forms[0];
        const checkStatus = form.checkValidity();
        form.reportValidity();

        if (checkStatus) {
            alert("Sign-up successful!");
        }
    });
}
addListener();
