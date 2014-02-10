describe('specs test', function () {
    it('should pass simple test', function () {
        expect(true).toBe(true);
    });
});

describe('stockRetriever', function () {
    var stockRetriever = window.stockRetriever;

    describe('dataProvider', function () {
        var dataProvider = stockRetriever.dataProvider;

        it('should return single stock price', function (specDone) {
            dataProvider
                .getStockPrices('MSFT')
                .done(function (res) {
                    var item = res[0];
                    expect(item.stockSymbol).toMatch('MSFT');
                    expect(item.lastTradePrice).toMatch(/\d.+/);
                    specDone();
                });
        });

        it('should return multiple stock prices', function (specDone) {
            dataProvider
                .getStockPrices(['MSFT', 'GOOG'])
                .done(function (res) {
                    var msft = res[0];
                    expect(msft.stockSymbol).toMatch('MSFT');
                    expect(msft.lastTradePrice).toMatch(/\d.+/);

                    var goog = res[1];
                    expect(goog.stockSymbol).toMatch('GOOG');
                    expect(goog.lastTradePrice).toMatch(/\d.+/);

                    specDone();
                });
        });

        it('should throw error for missing stockSymbols', function () {
            expect(function () { dataProvider.getStockPrices() }).toThrow();
        });

        it('should throw error for unexpected stockSymbols value', function () {
            expect(function () { dataProvider.getStockPrices(1) }).toThrow();
        });
    });

    describe('uiProvider', function () {
        var uiProvider = stockRetriever.uiProvider;
        var selectors = uiProvider.configuration.selectors;

        describe('displayLoading', function () {
            it('should display loading for current stock price', function () {
                spyOn(selectors.currentStockPrice, 'html');

                uiProvider.displayLoading();
                expect(selectors.currentStockPrice.html).toHaveBeenCalledWith('Loading ...');
            });
        });

        describe('getStockSymbol', function () {
            it('should get stock symbol from DOM', function () {
                spyOn(selectors.stockSymbol, 'val').and.returnValue('GOOG');

                var stockSymbol = uiProvider.getStockSymbol();
                expect(stockSymbol).toBe('GOOG');
            });

            it('should toUpperCase stock symbol', function () {
                spyOn(selectors.stockSymbol, 'val').and.returnValue('goog');

                var stockSymbol = uiProvider.getStockSymbol();
                expect(stockSymbol).toBe('GOOG');
            });

            it('should trim stock symbol', function () {
                spyOn(selectors.stockSymbol, 'val').and.returnValue(' GOOG ');

                var stockSymbol = uiProvider.getStockSymbol();
                expect(stockSymbol).toBe('GOOG');
            });
        });

        describe('setStockPrice', function () {
            it('should update current stock price', function () {
                spyOn(selectors.currentStockPrice, 'html');

                uiProvider.setStockPrice('GOOG', 1000.00, new Date());
                expect(selectors.currentStockPrice.html).toHaveBeenCalled();
            });

            it('should append stock price to log', function () {
                spyOn(selectors.stockPriceLog, 'append');

                uiProvider.setStockPrice('GOOG', 1000.00, new Date());
                expect(selectors.stockPriceLog.append).toHaveBeenCalled();
            });
        });
    });

    describe('app', function () {
        var app = stockRetriever.app;

        describe('init', function () {
            it('should create click handler on fetchButton selector', function () {
                var selectors = app.configuration.selectors;
                spyOn(selectors.fetchButton, 'on');

                app.init();
                expect(selectors.fetchButton.on).toHaveBeenCalledWith('click', app.fetch);
            });
        });

        describe('fetch', function () {
            var dataProvider = stockRetriever.dataProvider;
            var uiProvider = stockRetriever.uiProvider;
            var now = new Date();

            beforeEach(function () {
                spyOn(dataProvider, 'getStockPrices').and.callFake(function () {
                    return $.Deferred(function (deferred) {
                        deferred.resolve([{
                            stockSymbol: 'GOOG',
                            lastTradePrice: 1000.00,
                            retrieved: now
                        }]);
                    }).promise();
                });

                spyOn(uiProvider, 'displayLoading');
                spyOn(uiProvider, 'getStockSymbol').and.returnValue('GOOG');
                spyOn(uiProvider, 'setStockPrice');

                app.fetch();
            });

            it('should get stock symbol', function () {
                expect(uiProvider.getStockSymbol).toHaveBeenCalled();
            });

            it('should display loading', function () {
                expect(uiProvider.displayLoading).toHaveBeenCalled();
            });

            it('should get stock price', function () {
                expect(dataProvider.getStockPrices).toHaveBeenCalledWith('GOOG');
            });

            it('should update stock price information', function () {
                expect(uiProvider.setStockPrice).toHaveBeenCalledWith('GOOG', 1000.00, now);
            });
        });
    });
});
