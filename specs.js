describe('specs test', function () {
    it('should pass simple test', function () {
        expect(true).toBe(true);
    });
});

describe('stockRetriever', function () {
    var stockRetriever = window.stockRetriever;

    describe('dataProvider', function () {
        var dataProvider = stockRetriever.dataProvider;

        it('should return stock price', function (specDone) {
            dataProvider
                .getStockPrice('MSFT')
                .done(function (price) {
                    expect(price).toMatch(/\d.+/);
                    specDone();
                });
        });

        it('should throw Error for missing stockSymbol', function () {
            expect(function () { dataProvider.getStockPrice() }).toThrow();
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

                uiProvider.setStockPrice('GOOG', 1000.00);
                expect(selectors.currentStockPrice.html).toHaveBeenCalled();
            });

            it('should append stock price to log', function () {
                spyOn(selectors.stockPriceLog, 'html');

                uiProvider.setStockPrice('GOOG', 1000.00);
                expect(selectors.stockPriceLog.html).toHaveBeenCalled();
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

            beforeEach(function () {
                spyOn(dataProvider, 'getStockPrice').and.callFake(function () {
                    var promise = $.Deferred(function (deferred) {
                        deferred.resolve(1000.00);
                    }).promise();

                    return promise;
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
                expect(dataProvider.getStockPrice).toHaveBeenCalledWith('GOOG');
            });

            it('should update stock price information', function () {
                expect(uiProvider.setStockPrice).toHaveBeenCalledWith('GOOG', 1000.00);
            });
        });
    });
});
