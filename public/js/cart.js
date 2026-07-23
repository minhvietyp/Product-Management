// Update cart

const inputQuantity = document.querySelectorAll('input[name="quantity"]');
// truyen vao thuoc tinh dung dau ngoac vuong []

// id cua san pham dat trong thuoc tinh do
if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.getAttribute('product-id');
            const quantity = input.value;

            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}

//