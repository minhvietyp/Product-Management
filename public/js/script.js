// console.log("Hello world");
// Message Alert
const alertMessage = document.querySelector("[show-alert]");
if (alertMessage) {
  const time = parseInt(alertMessage.getAttribute("data-timer"));
  const closeAlert = alertMessage.querySelector("[close-alert]");


  setTimeout(() => {
    alertMessage.classList.add("alert-hidden");
  }, time);


  closeAlert.addEventListener("click", () => {
    alertMessage.classList.add("alert-hidden");
  });
}