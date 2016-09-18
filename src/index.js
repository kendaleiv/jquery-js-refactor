import $ from 'jquery';

import DataProvider from './data-provider';

$(function () {
  const dataProvider = new DataProvider();

  $('#fetch').on('click', () => {
    const stockSymbol = $.trim($('#stock-symbol').val().toUpperCase());

    $('#current-stock-price').html('Loading ...');

    dataProvider.getStockPrice(stockSymbol).then(lastTradePrice => {
      $('#current-stock-price').html(
        `<strong>${stockSymbol}</strong>: $${lastTradePrice}`
        + ` retrieved at ${new Date().toString()}`);

      $('#stock-price-log').html(
        `${$('#stock-price-log').html()}<li><strong>${stockSymbol}</strong> $${lastTradePrice}`
        + ` retrieved at ${new Date().toString()}</li>`);
    });
  });
});
