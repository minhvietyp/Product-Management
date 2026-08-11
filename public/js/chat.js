// Khởi tạo FileUploadWithPreview
let upload = null;
const uploadElement = document.querySelector("[data-upload-id='upload-image']");
if (uploadElement && typeof FileUploadWithPreview !== "undefined") {
    upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
        multiple: true,
        maxFileCount: 6
    });
}

// CLIENT SEND MESSAGE
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload ? upload.cachedFileArray : [];

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });

            e.target.elements.content.value = "";
            if (upload) upload.clearPreviewPanel();

            socket.emit("CLIENT_SEND_TYPING", "Hidden");
        }
    });
}

// SERVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myID = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    const boxTyping = document.querySelector(".chat .inner-list-typing");


    // Data tra ve khong phai luc nao cung co content
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (data.userId == myID) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    if (data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    }

    if (data.images && data.images.length > 0) {
        htmlImages += `<div class="inner-images">`;
        for (const image of data.images) {
            htmlImages += `<img src="${image}" />`;
        }
        htmlImages += `</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    if (boxTyping) {
        body.insertBefore(div, boxTyping);
    } else {
        body.appendChild(div);
    }

    body.scrollTop = body.scrollHeight;
});

// Scroll chat is bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Show Icon Chat
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    
    if (typeof Popper !== "undefined" && Popper.createPopper) {
        Popper.createPopper(buttonIcon, tooltip, {
            placement: "top",
        });
    }

    buttonIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        tooltip.classList.toggle("shown");
    });

    document.addEventListener("click", (e) => {
        if (!tooltip.contains(e.target) && !buttonIcon.contains(e.target)) {
            tooltip.classList.remove("shown");
        }
    });
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
    const inputChat = document.querySelector(".chat .inner-form input");
    if (inputChat) {
        emojiPicker.addEventListener("emoji-click", (e) => {
            const icon = e.detail.unicode;
            inputChat.value += icon;

            // giữ con trỏ chuột ở cuối
            const end = inputChat.value.length;

            inputChat.setSelectionRange(end, end);
            inputChat.focus();

            showTyping();
        });

        // typing Input Keyup
        inputChat.addEventListener("keyup", () => {
            showTyping();
        });
    }
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "Show" || data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
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
                elementListTyping.appendChild(boxTyping);
                if (bodyChat) bodyChat.scrollTop = bodyChat.scrollHeight;
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