import $ from 'jquery';

export default class DataProvider {
  getStockPrice(stockSymbol) {
    if (!stockSymbol) {
      throw new Error('Must provide a stockSymbol');
    }

    return fetch(`https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`)
      .then(res => res.json())
      .then(json => {
        const lastTradePrice = json.latestPrice;

        return lastTradePrice;
      });
  }
}
