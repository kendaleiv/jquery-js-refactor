import $ from 'jquery';

export default class StockRetriever {
  constructor(dataProvider, uiProvider) {
    this.dataProvider = dataProvider;
    this.uiProvider = uiProvider;

    this.configuration = {
      selectors: {
        fetchButton: $('#fetch')
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

  fetch() {
    const stockSymbol = this.uiProvider.getStockSymbol();

    this.uiProvider.displayLoading();

    return this.dataProvider.getStockPrice(stockSymbol).then(lastTradePrice => {
      this.uiProvider.setStockPrice(stockSymbol, lastTradePrice);
    });
  }
}
