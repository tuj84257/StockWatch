from api_call import ApiCall
import eel

eel.init('static')
api_call = ApiCall()

@eel.expose
def get_news(search_value):
    return api_call.get_news(search_value)

@eel.expose
def get_stock_price(search_value):
    return api_call.get_stock_price(search_value)

@eel.expose
def get_company_overview(search_value):
    return api_call.get_company_overview(search_value)

eel.start('main.html', size=(1144, 900))
