describe('specs test', function () {
    it('should pass simple test', function () {
        expect(true).toBe(true);
    });
});

describe('dataProvider', function () {
    var dataProvider = window.dataProvider;

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
