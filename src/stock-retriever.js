export default class StockRetriever {
  constructor(dataProvider, uiProvider) {
    this.dataProvider = dataProvider;
    this.uiProvider = uiProvider;
  }

  init() {
    this.uiProvider.init(this);
  }

  fetch() {
    const stockSymbol = this.uiProvider.getStockSymbol();

    this.uiProvider.displayLoading();

    return this.dataProvider.getStockPrice(stockSymbol).then(lastTradePrice => {
      this.uiProvider.setStockPrice(stockSymbol, lastTradePrice);
    });
  }
}
