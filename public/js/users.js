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

// Chuc nang tu choi loi moi ket ban
const listBtnRefuseFriend = document.querySelectorAll("button[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-friend");

            // gui len server su kien 
            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        })
    })
}


// Chuc nang chap nhan loi moi

const listBtnAcceptFriend = document.querySelectorAll("button[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accept");
            const userId = button.getAttribute("btn-accept-friend");

            // gui len server su kien 
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        })
    })
}


// Nhan thong tin do dai accept friend tu server
const badgeUsersAccept = document.querySelector("button[badge-users-accept]");
if (badgeUsersAccept) {
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
        if (userId === data.userId) {
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    })
}


// Nhan thong tin chap nhan loi moi ket ban tu server(SERVER_RETURN_INFO_ACCEPT_USER)
const dataUsersAccept = document.querySelector("[data-users-accept]");

if (dataUsersAccept) {
  const userId = dataUsersAccept.getAttribute("data-users-accept");

  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    if (userId === data.userId) {
      // 1. Tạo thẻ div col-6 bao bọc
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("user-id", data.inforUserA._id);

      // Xử lý avatar dự phòng nếu không có ảnh
      const avatarSrc = data.inforUserA.avatar ? data.inforUserA.avatar : "/images/avatar.png";

      // 2. Chuyển đổi sang chuẩn HTML (không dùng cú pháp Pug ở đây)
      div.innerHTML = `
        <div class="box-user" user-id="${data.inforUserA._id}">
          <div class="inner-avatar" status="${data.inforUserA.statusOnline || 'offline'}">
            <img src="${avatarSrc}" alt="${data.inforUserA.fullName}" />
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.inforUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.inforUserA._id}">
                Chấp nhận
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.inforUserA._id}">
                Xóa
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend disabled>
                Đã từ chối
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend disabled>
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      // 3. Sử dụng insertBefore để luôn chèn card mới lên ĐẦU danh sách
      // Nếu danh sách chưa có phần tử con nào, insertBefore vẫn hoạt động giống appendChild
      dataUsersAccept.insertBefore(div, dataUsersAccept.firstChild);

      // 4. Bắt sự kiện cho các nút mới được render động (Dynamic Event Binding)
      // Nút Xóa / Từ chối
      const buttonRefuse = div.querySelector("button[btn-refuse-friend]");
      if (buttonRefuse) {
        buttonRefuse.addEventListener("click", () => {
          buttonRefuse.closest(".box-user").classList.add("refuse");
          const uId = buttonRefuse.getAttribute("btn-refuse-friend");
          socket.emit("CLIENT_REFUSE_FRIEND", uId);
        });
      }

      // Nút Chấp nhận
      const buttonAccept = div.querySelector("button[btn-accept-friend]");
      if (buttonAccept) {
        buttonAccept.addEventListener("click", () => {
          buttonAccept.closest(".box-user").classList.add("accept");
          const uId = buttonAccept.getAttribute("btn-accept-friend");
          socket.emit("CLIENT_ACCEPT_FRIEND", uId);
        });
      }
    }
  });
}
