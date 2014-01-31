(function ($) {
    'use strict';

    if (!window.stockRetriever) {
        window.stockRetriever = {};
    }

    window.stockRetriever.dataProvider = {
        getStockPrice: function (stockSymbol) {
            if (!stockSymbol || typeof stockSymbol !== 'string') {
                throw new TypeError('Must provide a string for stockSymbol.');
            }

            var promise = $.Deferred(function (deferred) {
                var url = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' +  encodeURIComponent(stockSymbol) + '")&diagnostics=true&env=http://datatables.org/alltables.env';
                $.ajax(url).done(function (res) {
                    var quote = $(res).find('[symbol="' + stockSymbol + '"]');
                    var lastTradePrice = quote.find('LastTradePriceOnly').text();
    
                    deferred.resolve(lastTradePrice);
                }).fail(function (jqXHR) {
                    deferred.reject(jqXHR);
                });
            }).promise();

            return promise;
        }
    };
})(jQuery);

(function ($) {
    'use strict';

    if (!window.stockRetriever) {
        window.stockRetriever = {};
    }

    window.stockRetriever.uiProvider = {
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

            return this;
        },
        getStockSymbol: function () {
            var selectors = this.configuration.selectors;
            return $.trim(selectors.stockSymbol.val().toUpperCase());

            return this;
        },
        setStockPrice: function (stockSymbol, price) {
            var dateString = new Date().toString();

            var selectors = this.configuration.selectors;
            selectors.currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + price + ' retrieved at ' + dateString);
            selectors.stockPriceLog.append('<li><strong>' + stockSymbol + '</strong> $' + price + ' retrieved at ' + dateString + '</li>');

            return this;
        }
    };
})(jQuery);

(function ($, uiProvider, dataProvider) {
    'use strict';

    if (!window.stockRetriever) {
        window.stockRetriever = {};
    }

    window.stockRetriever.app = {
        configuration: {
            selectors: {
                fetchButton: $('#fetch')
            }
        },
        init: function () {
            var selectors = this.configuration.selectors;
            selectors.fetchButton.on('click', this.fetch);

            return this;
        },
        fetch: function () {
            var stockSymbol = uiProvider.getStockSymbol();

            uiProvider.displayLoading();

            dataProvider.getStockPrice(stockSymbol).then(function (lastTradePrice) {
                uiProvider.setStockPrice(stockSymbol, lastTradePrice);
            }).fail(function (jqXHR) {
                uiProvider.setStockPrice(stockSymbol, '(n/a)');
            });

            return this;
        }
    };
})(jQuery, stockRetriever.uiProvider, stockRetriever.dataProvider);

(function (app) {
    'use strict';

    app.init();
})(stockRetriever.app);
