import $ from 'jquery';

export default class UiProvider {
  constructor() {
    this.configuration = {
      selectors: {
        fetchButton: $('#fetch'),
        stockSymbol: $('#stock-symbol'),
        currentStockPrice: $('#current-stock-price'),
        stockPriceLog: $('#stock-price-log')
      }
    };
  }

  init() {
    const selectors = this.configuration.selectors;

    $(() => {
      selectors.fetchButton.on('click', () => {
        this.fetch();
      });
    });
  }

  displayLoading() {
    const selectors = this.configuration.selectors;

    selectors.currentStockPrice.html('Loading ...');
  }

  getStockSymbol() {
    const selectors = this.configuration.selectors;

    return $.trim(selectors.stockSymbol.val().toUpperCase());
  }

  setStockPrice(stockSymbol, price) {
    const dateString = new Date().toString();
    const selectors = this.configuration.selectors;

    selectors.currentStockPrice.html(
      `<strong>${stockSymbol}</strong>: $${price} retrieved at ${dateString}`);

    selectors.stockPriceLog.html(
      `${selectors.stockPriceLog.html()}<li><strong>${stockSymbol}</strong> $${price} retrieved at ${dateString}</li>`);
  }
}
