(function ($) {
    $(function () {
        var $stockSymbol = $('#stock-symbol');
        var $currentStockPrice = $('#current-stock-price');
        var $stockPriceLog = $('#stock-price-log');

        $('#fetch').on('click', function () {
            var stockSymbol = $.trim($stockSymbol.val().toUpperCase());

            $.ajax('http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + stockSymbol + '")&diagnostics=true&env=http://datatables.org/alltables.env', {
                beforeSend: function () {
                    $currentStockPrice.html('Loading ...');
                }
            }).done(function (res) {
                var quote = $(res).find('[symbol="' + stockSymbol + '"]');
                var lastTradePrice = quote.find('LastTradePriceOnly').text();

                $currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + lastTradePrice + ' retrieved at ' + new Date().toString());
                $stockPriceLog.html($stockPriceLog.html() + '<li><strong>' + stockSymbol + '</strong> $' + lastTradePrice + ' retrieved at ' + new Date().toString() + '</li>');
            });
        });
    });
})(jQuery);
