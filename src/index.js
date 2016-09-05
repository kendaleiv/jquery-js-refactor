/* eslint-env jquery */

$(function () {
  $('#fetch').on('click', function () {
    const stockSymbol = $.trim($('#stock-symbol').val().toUpperCase());
    const url = 'http://query.yahooapis.com/v1/public/yql'
      + `?q=select * from yahoo.finance.quotes where symbol in ("${stockSymbol}")`
      + '&diagnostics=true'
      + '&env=http://datatables.org/alltables.env';

    $('#current-stock-price').html('Loading ...');

    $.ajax(url).done(res => {
      const quote = $(res).find(`[symbol="${stockSymbol}"]`);
      const lastTradePrice = quote.find('LastTradePriceOnly').text();

      $('#current-stock-price').html(
        `<strong>${stockSymbol}</strong>: $${lastTradePrice}`
        + ` retrieved at ${new Date().toString()}`);

      $('#stock-price-log').html(
        `${$('#stock-price-log').html()}<li><strong>${stockSymbol}</strong> $${lastTradePrice}`
        + ` retrieved at ${new Date().toString()}</li>`);
    });
  });
});
