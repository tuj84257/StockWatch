const autoCompleteJS = new autoComplete({
    data: {
        src: async () => {
            // API key token
            const token = "YOUR_API_KEY_HERE";
            // User search query
            const query = document.querySelector("#search-box").value;
            // Fetch External Data Source
            const source = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${token}`);
            // Format data into JSON
            const data = await source.json();
            // Return Fetched data
            return data.bestMatches;
        },
        cache: false,
        key: ["1. symbol"],
    },
    trigger: {
        event: ["input", "focus"],
    },
    searchEngine: "strict",
    selector: "#search-box",
    highlight: true,
    maxResults: 5,
    resultItem: {
        content: (data, element) => {
            // Modify Results Item Style
            element.style = "display: flex; justify-content: space-between;";
            // Modify Results Item Content
            element.innerHTML = `
                <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    ${data.match}
                </span>
                <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase;">
                    ${data.value["2. name"]}
                </span>`;
        },
    },
    noResults: (dataFeedback, generateList) => {
        // Generate autoComplete List
        generateList(autoCompleteJS, dataFeedback, dataFeedback.results);
        // No Results List Item
        const result = document.createElement("div");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = `<span style="margin-left: 10px;">Found no results for "${dataFeedback.query}"</span>`;
        document.querySelector(`#${autoCompleteJS.resultsList.idName}`).appendChild(result);
    },
    onSelection: (feedback) => {
        document.querySelector("#search-box").blur();
        // Prepare User's Selected Value
        const selection = feedback.selection.value[feedback.selection.key];
        // Replace Input value with the selected value
        document.querySelector("#search-box").value = selection;
        // Console log autoComplete data feedback
        // console.log(feedback);
    },
});
