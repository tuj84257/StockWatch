# StockWatch :chart_with_upwards_trend:

**StockWatch** is a simple GUI application that lets a user see the changes in stock prices for the past 30 days. The user can search a symbol, and the program will generate a chart to display the information, as well as fetch the latest news related to the company for the past seven days.



<img style="box-shadow: 4px 4px 24px; border: 0;" src="Capture.png">



To build the GUI, I used [Eel](https://github.com/ChrisKnott/Eel), which is a "Python library for making simple Electron-like offline HTML/JS GUI apps, with full access to Python capabilities and libraries". I used [Bootstrap 5](https://getbootstrap.com/) to build the frontend interface. 

[Alpha Vantage](https://www.alphavantage.co/)'s API was used to fetch the stock price information, while the news are fetched by calling [Finnhub](https://finnhub.io/)'s stock API.

Additionally, **StockWatch** offers autocomplete search functionality with the help of the [autoComplete.js](https://github.com/TarekRaafat/autoComplete.js/) library. Thus, as the user types, they can select a value from a list of prepopulated ones, fetched from Alpha Vantage's [search endpoint](https://www.alphavantage.co/documentation/#symbolsearch).

Lastly, the stock price chart is generated with the help of the [Chart.js](https://www.chartjs.org/) library. The user can hover over the data points in the chart to see the closing stock price for a particular date. The color of the chart changes between green and red, based on the difference between the most recent closing price, and the first closing price of the 30-day period.



<p style="text-align: center;"><img src="https://iconarchive.com/download/i73027/cornmanthe3rd/plex/Other-python.ico" width="80"> <img src="https://camo.githubusercontent.com/a664defdd5c2ec93a3fbfb51e0f2aaafa5dc57bf1e13aa47456ced037b3cebe8/68747470733a2f2f676574626f6f7473747261702e636f6d2f646f63732f352e302f6173736574732f6272616e642f626f6f7473747261702d6c6f676f2d736861646f772e706e67" width="80"> <img src="https://avatars0.githubusercontent.com/u/10342521?s=280&v=4" width="80"> <img src="https://raw.githubusercontent.com/TarekRaafat/autoComplete.js/HEAD/docs/img/autoComplete.js.png" width="80"></p>

