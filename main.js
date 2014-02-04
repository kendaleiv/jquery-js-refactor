(function (global) {
    'use strict';

    global.stockRetriever = global.stockRetriever || {};
})(this);

(function (global, $) {
    'use strict';

    global.stockRetriever.dataProvider = (function() {
        var getStockPrice = function (stockSymbol) {
            if (typeof stockSymbol !== 'string') {
                throw new TypeError('Must provide a string for stockSymbol.');
            }

            var promise = $.Deferred(function (deferred) {
                var url = 'http://query.yahooapis.com/v1/public/yql' +
                    '?q=select * from yahoo.finance.quotes where symbol in ("' +
                    encodeURIComponent(stockSymbol) +
                    '")&diagnostics=true&env=http://datatables.org/alltables.env';
                    
                $.ajax(url).done(function (res) {
                    var quote = $(res).find('[symbol="' + stockSymbol + '"]');
                    var lastTradePrice = quote.find('LastTradePriceOnly').text();
    
                    deferred.resolve(lastTradePrice);
                }).fail(function (jqXHR) {
                    deferred.reject(jqXHR);
                });
            }).promise();

            return promise;
        };

        return {
            getStockPrice: getStockPrice
        }
    })();
})(this, jQuery);

(function (global, $) {
    'use strict';

    global.stockRetriever.uiProvider = (function() {
        var configuration = {
            selectors: {
                stockSymbol: $('#stock-symbol'),
                currentStockPrice: $('#current-stock-price'),
                stockPriceLog: $('#stock-price-log')
            }
        };

        var displayLoading = function () {
            var selectors = configuration.selectors;
            selectors.currentStockPrice.html('Loading ...');

            return this;
        };

        var getStockSymbol = function () {
            var selectors = configuration.selectors;
            return $.trim(selectors.stockSymbol.val()).toUpperCase();
        };

        var setStockPrice = function (stockSymbol, price) {
            var dateString = new Date().toString();

            var selectors = configuration.selectors;
            selectors.currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + price + ' retrieved at ' + dateString);
            selectors.stockPriceLog.append('<li><strong>' + stockSymbol + '</strong> $' + price + ' retrieved at ' + dateString + '</li>');

            return this;
        };

        return {
            displayLoading: displayLoading,
            getStockSymbol: getStockSymbol,
            setStockPrice: setStockPrice,
            getConfiguration: function() {
                return $.extend({}, configuration);
            }
        }
    })();
})(this, jQuery);

(function (global, $, uiProvider, dataProvider) {
    'use strict';

    global.stockRetriever.app = (function() {
        var configuration = {
            selectors: {
                fetchButton: $('#fetch')
            }
        };

        var init = function () {
            var selectors = configuration.selectors;
            selectors.fetchButton.on('click', this.fetch);

            return this;
        };

        var fetch = function () {
            var stockSymbol = uiProvider.getStockSymbol();

            uiProvider.displayLoading();

            dataProvider.getStockPrice(stockSymbol).then(function (lastTradePrice) {
                uiProvider.setStockPrice(stockSymbol, lastTradePrice);
            }).fail(function (jqXHR) {
                uiProvider.setStockPrice(stockSymbol, '(n/a)');
            });

            return this;
        };

        return {
            init: init,
            fetch: fetch,
            getConfiguration: function() {
                return $.extend({}, configuration);
            }
        }
    })();
})(this, jQuery, this.stockRetriever.uiProvider, this.stockRetriever.dataProvider);

(function (global, app) {
    'use strict';

    app.init();
})(this, this.stockRetriever.app);
