// JS xử lý danh sách bạn bè, người dùng chưa kết bạn
const listBtnAddFriend = document.querySelectorAll("button[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            
            // gui len server su kien 
            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}

// Chuc nang huy loi moi ket ban 

const listBtnCancelFriend = document.querySelectorAll("button[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            
            // gui len server su kien 
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
