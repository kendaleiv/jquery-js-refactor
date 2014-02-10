(function (global) {
    'use strict';

    global.stockRetriever = global.stockRetriever || {};
})(this);

(function (global, $) {
    'use strict';

    global.stockRetriever.dataProvider = {
        getStockPrices: function (stockSymbols) {
            if (typeof stockSymbols !== 'string' && !$.isArray(stockSymbols)) {
                throw new TypeError('Must provide a string or an array for stockSymbols.');
            }
            
            if (typeof stockSymbols === 'string') {
                stockSymbols = [stockSymbols];
            }

            return $.Deferred(function (deferred) {
                var url = getUrl(stockSymbols);

                $.get(url)
                    .done(function (res) {
                        var result = parseResponse(res);
                        deferred.resolve(result);
                    })
                    .fail(deferred.reject);
            }).promise();
        }
    };

    function getUrl(stockSymbols) {
        var url = 'http://query.yahooapis.com/v1/public/yql' +
            '?q=select * from yahoo.finance.quotes where symbol in ("' +
            stockSymbols.map(encodeURIComponent).join() +
            '")&diagnostics=true&env=http://datatables.org/alltables.env';

        return url;
    }

    function parseResponse(xml) {
        var $query = $(xml).find('query').first();
        var created = new Date($query.attr('yahoo:created'));
        var quotes = $query.find('quote').get();
        
        return quotes.map(function (quote) {
            var $quote = $(quote);
            return {
                stockSymbol: $quote.attr('symbol'),
                lastTradePrice: parseFloat($quote.find('LastTradePriceOnly').text()),
                retrieved: created
            };
        });
    }
})(this, jQuery);

(function (global, $) {
    'use strict';

    global.stockRetriever.uiProvider = {
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
            return $.trim(selectors.stockSymbol.val()).toUpperCase();
        },
        setStockPrice: function (stockSymbol, price, retrievedAt) {
            var selectors = this.configuration.selectors;
            var retrievedAtStr = retrievedAt.toString();

            selectors.currentStockPrice.html('<strong>' + stockSymbol + '</strong>: $' + price + ' retrieved at ' + retrievedAtStr);
            selectors.stockPriceLog.append('<li><strong>' + stockSymbol + '</strong> $' + price + ' retrieved at ' + retrievedAtStr + '</li>');

            return this;
        }
    };
})(this, jQuery);

(function (global, $, uiProvider, dataProvider) {
    'use strict';

    global.stockRetriever.app = {
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

            dataProvider.getStockPrices(stockSymbol).then(function (res) {
                var item = res[0];
                uiProvider.setStockPrice(item.stockSymbol, item.lastTradePrice, item.retrieved);
            }).fail(function (jqXHR) {
                uiProvider.setStockPrice(stockSymbol, '(n/a)');
            });

            return this;
        }
    };
})(this, jQuery, this.stockRetriever.uiProvider, this.stockRetriever.dataProvider);

(function (global, app) {
    'use strict';

    app.init();
})(this, this.stockRetriever.app);
