// Button Status 

// lấy ra các element tự định nghĩa
const buttonStatus = document.querySelectorAll("[button-status]");

if(buttonStatus.length > 0) {
    // new URL() breaks the sentence into words that can easily
    // understand and edit 
    let url = new URL(window.location.href); 

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
        
            if(status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            // chuyển hướng sang trang khác
            window.location.href = url.href;
        })
    })
}

// End Button Status


// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        // stop reloading the page after submitting 
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            // The else is there to remove the old keyword from the URL when the user clears the search box.
            // Without it, the old search stays stuck in the URL forever.
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
// End Form Search



// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            
            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}
// End Pagination


// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if(countChecked === inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
            
        })
    })
}
// End Checkbox Multi


// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        if(inputsChecked.length > 0) {
            const actionSelect = e.target.elements.type.value;
            
            if(actionSelect == "delete-all") {
                const isConfirm = confirm(`Bạn có chắc muốn xóa ${inputsChecked.length} sản phẩm?`);

                if(!isConfirm) {
                    return;
                }
            }

            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if(actionSelect == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']")
                        .value;
                    
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id)
                }
                
            });
            
            // form input không lưu được array nên phải convert thành string
            inputIds.value = ids.join(", ");
            
            // gửi form đi
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    })
}
// End Form Change Multi