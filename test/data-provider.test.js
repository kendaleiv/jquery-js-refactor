import test from 'ava';
import fetchMock from 'fetch-mock';

import DataProvider from '../src/data-provider';

test.beforeEach(() => {
  const response = `<?xml version="1.0" encoding="UTF-8"?>
<query><results><quote symbol="TEST"><LastTradePriceOnly>123.45</LastTradePriceOnly></quote></results></query>`;

  fetchMock.get('*', response);
});

test.afterEach(() => {
  fetchMock.restore();
});

test('should return stock price', t => {
  return new DataProvider()
    .getStockPrice('TEST')
    .then(lastTradePrice => {
      t.is(lastTradePrice, '123.45');
    });
});

test('should throw Error for missing stockSymbol', t => {
  t.throws(() => new DataProvider().getStockPrice());
});
