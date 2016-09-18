import $ from 'jquery';

import DataProvider from './data-provider';
import UiProvider from './ui-provider';

$(function () {
  const dataProvider = new DataProvider();
  const uiProvider = new UiProvider();

  $('#fetch').on('click', () => {
    const stockSymbol = uiProvider.getStockSymbol();

    uiProvider.displayLoading();

    dataProvider.getStockPrice(stockSymbol).then(lastTradePrice => {
      uiProvider.setStockPrice(stockSymbol, lastTradePrice);
    });
  });
});
