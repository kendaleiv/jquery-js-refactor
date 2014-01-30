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

(function ($) {
    'use strict';

    window.uiProvider = {
        configuration: {
            selectors: {
                stockSymbol: $('#stock-symbol'),
                currentStockPrice: $('#current-stock-price'),
                stockPriceLog: $('#stock-price-log')
            }
        },
        displayLoading: function () {
            var selectors = this.configuration.selectors;
            selectors.currentStockPrice.html('Loading ...');
        },
        getStockSymbol: function () {
            var selectors = this.configuration.selectors;
            return $.trim(selectors.stockSymbol.val().toUpperCase());
        },
        setStockPrice: function (stockSymbol, price) {
            var dateString = new Date().toString();

            var selectors = this.configuration.selectors;
            selectors.currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + price + ' retrieved at ' + dateString);
            selectors.stockPriceLog.html(selectors.stockPriceLog.html() + '<li><strong>' + stockSymbol + '</strong> $' + price + ' retrieved at ' + dateString + '</li>');
        }
    };
})(jQuery);

(function (uiProvider, dataProvider) {
    'use strict';

    window.stockRetriever = {
        fetch: function () {
            var stockSymbol = uiProvider.getStockSymbol();

            uiProvider.displayLoading();

            dataProvider.getStockPrice(stockSymbol).done(function (lastTradePrice) {
                uiProvider.setStockPrice(stockSymbol, lastTradePrice);
            });
        }
    };
})(uiProvider, dataProvider);

(function ($, stockRetriever) {
    'use strict';

    $(function () {
        $('#fetch').on('click', stockRetriever.fetch);
    });
})(jQuery, stockRetriever);
