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


// detect brower or tab closing 



// window.addEventListener("beforeunload", (e) => {
//   WebSocket.emit("CLIENT_CLOSE_WEB", userId);
//   e.preventDefault();

//   // emit sự kiện socket
// })

// window.addEventListener("unload", () => {
  
// })
