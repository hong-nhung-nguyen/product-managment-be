// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit();

        })
    })
}
// End change status

// Change Featured 
const buttonsChangeFeatured = document.querySelectorAll("[button-change-featured]");
if(buttonsChangeFeatured.length > 0) {
    const formChangeFeatured = document.querySelector("#form-change-featured");
    const dataPath = formChangeFeatured.getAttribute("data-path");

    buttonsChangeFeatured.forEach(button => {
        button.addEventListener("click", () => {
            const featuredCurrent = button.getAttribute("data-featured");
            const id = button.getAttribute("data-id");

            let featuredChange = featuredCurrent == "1" ? "0" : "1";
            
            const action = dataPath + `/${featuredChange}/${id}?_method=PATCH`;
            formChangeFeatured.action = action;

            formChangeFeatured.submit();

        })
    })
}
// End Change Featured

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const dataPath = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?");

            if(isConfirm) {
                const id = button.getAttribute("data-id");
                
                const action = `${dataPath}/${id}?_method=DELETE`;

                formDeleteItem.action = action;

                formDeleteItem.submit();

            }
        })
    })
}
// End Delete Item



