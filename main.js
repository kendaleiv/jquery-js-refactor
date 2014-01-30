(function ($) {
    'use strict';

    window.dataProvider = {
        getStockPrice: function (stockSymbol) {
            if (!stockSymbol) {
                throw new Error('Must provide a stockSymbol.');
            }

            var deferred = $.Deferred();

            var url = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + stockSymbol + '")&diagnostics=true&env=http://datatables.org/alltables.env';
            $.ajax(url).done(function (res) {
                var quote = $(res).find('[symbol="' + stockSymbol + '"]');
                var lastTradePrice = quote.find('LastTradePriceOnly').text();

                deferred.resolve(lastTradePrice);
            });

            return deferred.promise();
        }
    };
})(jQuery);

(function ($, dataProvider) {
    'use strict';

    $(function () {
        var $stockSymbol = $('#stock-symbol');
        var $currentStockPrice = $('#current-stock-price');
        var $stockPriceLog = $('#stock-price-log');

        $('#fetch').on('click', function () {
            var stockSymbol = $.trim($stockSymbol.val().toUpperCase());

            $currentStockPrice.html('Loading ...');

            dataProvider.getStockPrice(stockSymbol).done(function (lastTradePrice) {            
                var dateString = new Date().toString();

                $currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + lastTradePrice + ' retrieved at ' + dateString);
                $stockPriceLog.html($stockPriceLog.html() + '<li><strong>' + stockSymbol + '</strong> $' + lastTradePrice + ' retrieved at ' + dateString + '</li>');
            });
        });
    });
})(jQuery, dataProvider);
