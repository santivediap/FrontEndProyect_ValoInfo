document.getElementById("search-button")
.addEventListener("click", (ev) => {
    ev.preventDefault()

    let submitButton = document.getElementById("player-search")

    // Search validation

    if(/^([a-zA-Z0-9]+)#([A-Z0-9]+)_(eu|na|ap|kr)$/gm.test(submitButton.value)) {
        let arraySearch = [.../^([a-zA-Z0-9]+)#([A-Z0-9]+)_(eu|na|ap|kr)$/gm.exec(submitButton.value)]
        arraySearch.shift()

        localStorage.search = JSON.stringify(arraySearch)
        window.location.assign("./pages/search.html");

    } else {
        let errorMessage = document.getElementById("search-error")
        errorMessage.className = "search-error"
        errorMessage.innerHTML = "Invalid search"
    }
})

function checkUserRegion() {

    let dataTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let region = /([a-zA-Z]+)\//gm.exec(dataTimeZone)[1]

    switch(region) {
        case "Europe":
            return "eu"
        case "America":
            return "na"
        case "Asia":
            return "ap"
        default:
            return "kr"
    }
}