// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const url = new URL(window.location.href);
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
}

// Form Search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = new URL(window.location.href);
    const keyword = event.target.elements.keyword.value.trim();

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
