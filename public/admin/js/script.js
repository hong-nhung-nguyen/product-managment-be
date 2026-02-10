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