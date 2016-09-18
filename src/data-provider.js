import $ from 'jquery';

export default class DataProvider {
  getStockPrice(stockSymbol) {
    if (!stockSymbol) {
      throw new Error('Must provide a stockSymbol');
    }

    const url = 'http://query.yahooapis.com/v1/public/yql'
      + `?q=select * from yahoo.finance.quotes where symbol in ("${stockSymbol}")`
      + '&diagnostics=true'
      + '&env=http://datatables.org/alltables.env';

    return fetch(url)
      .then(res => res.text())
      .then(text => {
        const quote = $(text).find(`[symbol="${stockSymbol}"]`);
        const lastTradePrice = quote.find('LastTradePriceOnly').text();

        return lastTradePrice;
      });
  }
}
