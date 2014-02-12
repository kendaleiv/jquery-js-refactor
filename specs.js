describe('specs test', function () {
    it('should pass simple test', function () {
        expect(true).toBe(true);
    });
});

describe('stockRetriever', function () {
    beforeEach(function () {
        jasmine.addMatchers({
            toBeADecimalNumber: function () {
                return {
                    compare: function (actual) {
                        return {
                            pass: typeof actual === 'number' && actual.toString().match(/\d+\.+\d+/)
                        }
                    }
                };
            }
        });
    });

    var stockRetriever = window.stockRetriever;

    describe('dataProvider', function () {
        var dataProvider = stockRetriever.dataProvider;

        it('should return single price', function (specDone) {
            dataProvider
                .getPrices('MSFT')
                .done(function (res) {
                    var item = res[0];
                    expect(item.symbol).toBe('MSFT');
                    expect(item.lastTradePrice).toBeADecimalNumber();
                    specDone();
                });
        });

        it('should return multiple prices', function (specDone) {
            dataProvider
                .getPrices(['MSFT', 'GOOG'])
                .done(function (res) {
                    var msft = res[0];
                    expect(msft.symbol).toBe('MSFT');
                    expect(msft.lastTradePrice).toBeADecimalNumber();

                    var goog = res[1];
                    expect(goog.symbol).toBe('GOOG');
                    expect(goog.lastTradePrice).toBeADecimalNumber();

                    specDone();
                });
        });

        it('should throw error for missing symbols', function () {
            expect(function () { dataProvider.getPrices() }).toThrow();
        });

        it('should throw error for unexpected symbols value', function () {
            expect(function () { dataProvider.getPrices(1) }).toThrow();
        });
    });

    describe('uiProvider', function () {
        var uiProvider = stockRetriever.uiProvider;
        var selectors = uiProvider.configuration.selectors;

        describe('displayLoading', function () {
            it('should display loading for current price', function () {
                spyOn(selectors.currentPrice, 'html');

                uiProvider.displayLoading();
                expect(selectors.currentPrice.html).toHaveBeenCalledWith('Loading ...');
            });
        });

        describe('getSymbol', function () {
            it('should get symbol from DOM', function () {
                spyOn(selectors.symbol, 'val').and.returnValue('GOOG');

                var symbol = uiProvider.getSymbol();
                expect(symbol).toBe('GOOG');
            });

            it('should toUpperCase symbol', function () {
                spyOn(selectors.symbol, 'val').and.returnValue('goog');

                var symbol = uiProvider.getSymbol();
                expect(symbol).toBe('GOOG');
            });

            it('should trim symbol', function () {
                spyOn(selectors.symbol, 'val').and.returnValue(' GOOG ');

                var symbol = uiProvider.getSymbol();
                expect(symbol).toBe('GOOG');
            });
        });

        describe('setPrice', function () {
            it('should update current price', function () {
                spyOn(selectors.currentPrice, 'html');

                uiProvider.setPrice('GOOG', 1000.00, new Date());
                expect(selectors.currentPrice.html).toHaveBeenCalled();
            });

            it('should append price to log', function () {
                spyOn(selectors.priceLog, 'append');

                uiProvider.setPrice('GOOG', 1000.00, new Date());
                expect(selectors.priceLog.append).toHaveBeenCalled();
            });

            it('should prevent xss attacks', function () {
                spyOn(selectors.currentPrice, 'html');

                var now = new Date();
                uiProvider.setPrice('<script>alert("pwned");</script>', 1000.00, now);
                expect(selectors.currentPrice.html).toHaveBeenCalledWith(
                    '<strong>&lt;script&gt;alert("pwned");&lt;/script&gt;</strong>: $1000 retrieved at ' + now.toString());
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
                spyOn(dataProvider, 'getPrices').and.callFake(function () {
                    return $.Deferred(function (dfd) {
                        dfd.resolve([{
                            symbol: 'GOOG',
                            lastTradePrice: 1000.00,
                            retrieved: now
                        }]);
                    }).promise();
                });

                spyOn(uiProvider, 'displayLoading');
                spyOn(uiProvider, 'getSymbol').and.returnValue('GOOG');
                spyOn(uiProvider, 'setPrice');

                app.fetch();
            });

            it('should get symbol', function () {
                expect(uiProvider.getSymbol).toHaveBeenCalled();
            });

            it('should display loading', function () {
                expect(uiProvider.displayLoading).toHaveBeenCalled();
            });

            it('should get price', function () {
                expect(dataProvider.getPrices).toHaveBeenCalledWith('GOOG');
            });

            it('should update price information', function () {
                expect(uiProvider.setPrice).toHaveBeenCalledWith('GOOG', 1000.00, now);
            });
        });
    });
});
