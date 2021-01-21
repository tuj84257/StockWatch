// function that returns a list with the month, day, and year
// from the date string coming from the AlphaVantage API
function convertDate(dateString){
    unixDate = new Date(Date.parse(dateString));
    unixDateToString = unixDate.toUTCString().split(' ');
    day = unixDateToString[1];
    month = unixDateToString[2];
    year = unixDateToString[3];
    dateArray = [month, day, year];
    return dateArray;
}

// function that converts unix timestamp to human-readable format
function convertUnixDate(datetime){                                     // input is a number
    dateObject = new Date(datetime * 1000);                             // https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
    month = dateObject.toLocaleString("en-US", {month: "short"});
    day = dateObject.toLocaleString("en-US", {day: "numeric"});
    year = dateObject.toLocaleString("en-US", {year: "numeric"});
    str = month + ". " + day + ", " + year;
    return str;
}

// function that returns the color of the chart's line based on
// the difference between the closing prices
function lineColor(differenceClosingPrice){
    if(differenceClosingPrice < 0)
        return ['#dc3545', 'text-danger'];               // red
    else
        return ['#20CF9B', 'text-success'];              // green
}

// What happens when you click the search button
$('#search-button').on('click', async function(){
    $("#stock-price-info").empty();
    $("#news-section").empty();
    // start spinner
    $("#news-section").append(`
        <div class="text-center">
            <div class="spinner-border text-success" role="status"></div>
        </div>
    `);

    var searchValue = $('#search-box').val();

    // The lines commented below won't work because you can't have to awaits in one async function one after the other
    // `await Promise.all solves the issue` => source: https://stackoverflow.com/a/60092577/13659134
    //  stockData = await eel.get_stock_price(searchValue)();
    //  companyOverview = await eel.get_company_overview(searchValue)();

    let [stockData, companyOverview, newsData] = await Promise.all([
        eel.get_stock_price(searchValue)(),
        eel.get_company_overview(searchValue)(),
        eel.get_news(searchValue)()
    ]);

    var labelsArray = [];  // x-axis data
    var dataArray = [];    // y-axis data

    stockData = JSON.parse(stockData);  // data coming from json.dumps in python should be parsed in Javascript -> stockData becomes an Object type

    for(var date of Object.entries(stockData)){
        dateArray = convertDate(date[0]);
        dateString = dateArray[0] + ' ' + dateArray[1] + ', ' + dateArray[2];
        labelsArray.unshift(dateString);         // add date
        dataArray.unshift(date[1]["4. close"]);  // add stock price
    }

    // Fetch and calculate stock price information
    openPrice = Object.entries(stockData)[0][1]["1. open"].slice(0, -2);     // remove last two characters from string
    highPrice = Object.entries(stockData)[0][1]["2. high"].slice(0, -2);
    lowPrice = Object.entries(stockData)[0][1]["3. low"].slice(0, -2);
    closePrice = Object.entries(stockData)[0][1]["4. close"].slice(0, -2);
    prevClosePrice = Object.entries(stockData)[1][1]["4. close"].slice(0, -2);
    firstClosePrice = Object.entries(stockData)[Object.entries(stockData).length - 1][1]["4. close"];
    dateOfLastClosingPrice = Object.entries(stockData)[0][0];
    dateOfLastClosingPriceArray = convertDate(dateOfLastClosingPrice);
    dateOfLastClosingPrice = dateOfLastClosingPriceArray[0] + '. ' + dateOfLastClosingPriceArray[1] + ', ' + dateOfLastClosingPriceArray[2];
    difference = (parseFloat(closePrice) - parseFloat(prevClosePrice)).toFixed(2);
    differenceMonth = (parseFloat(closePrice) - parseFloat(firstClosePrice)).toFixed(2);

    if(difference > 0)
        differenceString = '+' + difference.toString();
    else
        differenceString = difference.toString();

    if(differenceMonth > 0)
        differenceMonthString = '+' + differenceMonth.toString();
    else
        differenceMonthString = differenceMonth.toString();

    yearlyRangeString = parseFloat(companyOverview["52WeekLow"]).toFixed(2).toString() + " - " + parseFloat(companyOverview["52WeekHigh"]).toFixed(2).toString();

    $(".spinner-border").hide();        // hide spinner

    // Append the HTML
    $("#stock-price-info").append(`\
        <h2 class="white mt-4 lead text-center">` + searchValue + ` <span class="` + lineColor(differenceMonth)[1] + `"><b>` + differenceMonthString + `</b></span> <span class="text-secondary" id="#past-month">past month</span></h2>\
        <h3 class="white lead text-center text-secondary" id="company-name">${companyOverview.Name}</h3>\
        <div>\
            <div class="d-inline-flex white" id="closing-price">\
                <h5>` + closePrice + `</h5>\
                <h6 class="display-5 text-secondary" id="the-dollar">USD</h6>\
                <span class="` + lineColor(difference)[1] + `" id="difference">` + differenceString + `</span>\
            </div>\
            <p class="text-secondary white" id="fetch-date">\
                Last closing price fetched on: ` + dateOfLastClosingPrice + `<span class="float-end" id="yearly-range">52-week range: ${yearlyRangeString} USD</span>\
            </p>\
        </div>\
        <div class="chart-container mt-4 mb-4">\
            <canvas id="myChart"></canvas>\
        </div>\
        <div id="additional-data">\
            <div class="row white display-5" id="additional-data-row">\
                <div class="col-3">\
                    <p><b>Open:</b> ` + openPrice + ` <span class="text-secondary the-dollar">USD</span></p>\
                </div>\
                <div class="col-3">\
                    <p><b>High:</b> ` + highPrice + ` <span class="text-secondary the-dollar">USD</span></p>\
                </div>\
                <div class="col-3">\
                    <p><b>Low:</b> ` + lowPrice + ` <span class="text-secondary the-dollar">USD</span></p>\
                </div>\
                <div class="col-3">\
                    <p><b>Prev. close:</b> ` + prevClosePrice + ` <span class="text-secondary the-dollar">USD</span></p>\
                </div>\
            </div>\
        </div>\
    `)

    // The stock price chart
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: '',
                data: dataArray,
                lineTension: 0,
                pointHitRadius: 6,
                backgroundColor: 'transparent',
                borderColor: lineColor(differenceMonth)[0],
                borderWidth: 3
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        display: false
                    },
                    gridLines: {
                        display:false
                    }
                }]
            },
            elements: {
                    point:{
                        radius: 0
                    }
            },
            // The settings below remove the dataset label
            legend: {
                display: false
            },
            tooltips: {
                displayColors: false,     // removes the square figure in the tooltip
                callbacks: {
                   label: function(tooltipItem, data) {
                       var label = tooltipItem.yLabel;
                       if(label)
                           label += ' USD | ' + tooltipItem.xLabel;
                       return label
                   },
                   title: function(tooltipItems, data) {
                       return '';
                   },
                },
            }
        }
    });

    articleNumber = 0;

    $("#news-section").append(`
        <hr class="white">\
        <div class="container-fluid">\
            <h2 class="lead text-center mt-4 white">News From The Last 7 Days</h2>\
            <div class="news-cards"></div>\
        </div>\
    `);

    newsData.forEach(function(article){
        $(".news-cards").append(`\
            <div class="card m-4 bg-dark border-secondary">\
                <div class="card-body">\
                    <h5 class="card-title white">` + article.headline + `</h5>\
                    <h6 class="card-subtitle mb-2 text-success white">` + article.source + ` - ${convertUnixDate(article.datetime)}</h6>\
                    <p class="card-text white">` + article.summary + `</p>\
                    <a href="` + article.url + `" class="card-link white">Link to article</a>\
                </div>\
            </div>\
        `);
        articleNumber = articleNumber + 1;
        if(articleNumber == 10)
            throw new Error(); // break (don't display more that 10 articles )
    });
});
