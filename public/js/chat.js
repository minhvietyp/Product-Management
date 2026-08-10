import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// CLIENT SEND MESSAGE

const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "Hidden");
        }
    })
}


// SERVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myID = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

    let htmlFullName = "";

    if (data.userId == myID) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;
    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;
});

// Scroll chat is bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}


// Show Icon Chat
const buttonIcon = document.querySelector("button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip, {
        placement: "top",
    });

    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown");
    })
}
// End Show Icon Chat

// Show Typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "Show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "Hidden");
    }, 2000);
}


// Insert Icon to Input

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form.input");
    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        inputChat.value += icon;

        // giữ con trỏ chuột ở cuối
        const end = inputChat.value.length;

        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        if (inputChat.value) {
            showTyping();
        }
    });

    // typing Input Keyup

    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
}


// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);

            boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
      `;
            //   gặp lỗi mối khi gõ chứ giừ thì nó chèn 1 lần gõ vào 
            // xử lí tình huống khi gõ thì nó sẽ hiện lên(Tìm xem người dung đã tồn tại hay chưa xong mới vẽ ra)
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
// End SERVER_RETURN_TYPING

