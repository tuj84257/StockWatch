from datetime import date, datetime, timedelta
import requests
import json

class ApiCall:
    def __init__(self):
        self.news_api_base_url = 'https://finnhub.io/api/v1/company-news?'
        self.alpha_vantage_base_url = 'https://www.alphavantage.co/query?'
        self.finnhub_news_api_key = 'YOUR_API_KEY_HERE'
        self.alpha_vantage_api_key = 'YOUR_API_KEY_HERE'

    def get_news(self, search_value):
        seven_days_ago = datetime.now() - timedelta(7)
        base_url = self.news_api_base_url
        parameters = {
            'symbol': search_value,
            'from': str(datetime.date(seven_days_ago)),
            'to': str(date.today()),
            'token': self.finnhub_news_api_key
        }
        return requests.get(base_url, parameters).json()

    def get_stock_price(self, search_value):
        base_url = self.alpha_vantage_base_url
        parameters = {
            'function': 'TIME_SERIES_DAILY',
            'symbol': search_value,
            'apikey': self.alpha_vantage_api_key
        }
        json_data = requests.get(base_url, parameters).json()
        # get start date from 30 days ago
        start_date = datetime.now() - timedelta(30)
        last_30_days = {}
        # add the last 30 days to the dictionary
        for _date in json_data['Time Series (Daily)']:
            if datetime.strptime(_date, '%Y-%m-%d') >= start_date:
                last_30_days[_date] = json_data['Time Series (Daily)'][_date]
        # convert dictionary to JSON
        json_last_30_days = json.dumps(last_30_days)
        return json_last_30_days

    def get_company_overview(self, search_value):
        base_url = self.alpha_vantage_base_url
        parameters = {
            'function': 'OVERVIEW',
            'symbol': search_value,
            'apikey': self.alpha_vantage_api_key
        }
        return requests.get(base_url, parameters).json()
