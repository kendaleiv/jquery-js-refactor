(function (global, $) {
    'use strict';
    global.stockRetriever = global.stockRetriever || {};

    global.stockRetriever.dataProvider = {
        getPrices: function (symbols) {
            if (typeof symbols !== 'string' && !$.isArray(symbols)) {
                throw new TypeError('Must provide a string or an array for symbols.');
            }
            
            if (typeof symbols === 'string') {
                symbols = [symbols];
            }

            return $.Deferred(function (deferred) {
                var url = getUrl(symbols);

                $.get(url)
                    .done(function (res) {
                        var result = parseResponse(res);
                        deferred.resolve(result);
                    })
                    .fail(deferred.reject);
            }).promise();
        }
    };

    function getUrl(symbols) {
        return 'http://query.yahooapis.com/v1/public/yql' +
            '?q=select * from yahoo.finance.quotes where symbol in ("' +
            symbols.map(encodeURIComponent).join() +
            '")&diagnostics=true&env=http://datatables.org/alltables.env';
    }

    function parseResponse(xml) {
        var $query = $(xml).find('query').first();
        var created = new Date($query.attr('yahoo:created'));
        var quotes = $query.find('quote').get();
        
        return quotes.map(function (quote) {
            var $quote = $(quote);
            return {
                symbol: $quote.attr('symbol'),
                lastTradePrice: parseFloat($quote.find('LastTradePriceOnly').text()),
                retrieved: created
            };
        });
    }
})(this, jQuery);

(function (global, $) {
    'use strict';
    global.stockRetriever = global.stockRetriever || {};

    global.stockRetriever.uiProvider = {
        configuration: {
            selectors: {
                symbol: $('#stock-symbol'),
                currentPrice: $('#current-stock-price'),
                priceLog: $('#stock-price-log')
            }
        },
        displayLoading: function () {
            var selectors = this.configuration.selectors;
            selectors.currentPrice.html('Loading ...');

            return this;
        },
        getSymbol: function () {
            var selectors = this.configuration.selectors;
            return $.trim(selectors.symbol.val()).toUpperCase();
        },
        setPrice: function (symbol, price, retrievedAt) {
            var selectors = this.configuration.selectors;
            var retrievedAtStr = retrievedAt.toString();

            selectors.currentPrice.html('<strong>' + htmlEncode(symbol) + '</strong>: $' + htmlEncode(price) + ' retrieved at ' + htmlEncode(retrievedAtStr));
            selectors.priceLog.append('<li><strong>' + htmlEncode(symbol) + '</strong> $' + htmlEncode(price) + ' retrieved at ' + htmlEncode(retrievedAtStr) + '</li>');

            return this;
        }
    };

    // http://stackoverflow.com/a/1219983/941536
    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }
})(this, jQuery);

(function (global, $, uiProvider, dataProvider) {
    'use strict';
    global.stockRetriever = global.stockRetriever || {};

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
            var symbol = uiProvider.getSymbol();

            uiProvider.displayLoading();

            dataProvider.getPrices(symbol).then(function (res) {
                var item = res[0];
                uiProvider.setPrice(item.symbol, item.lastTradePrice, item.retrieved);
            }).fail(function () {
                uiProvider.setPrice(item.symbol, '(n/a)');
            });

            return this;
        }
    };
})(this, jQuery, this.stockRetriever.uiProvider, this.stockRetriever.dataProvider);

(function (global, app) {
    'use strict';

    app.init();
})(this, this.stockRetriever.app);
