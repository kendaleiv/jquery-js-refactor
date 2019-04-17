global.fetch = require('jest-fetch-mock');

import DataProvider from '../src/data-provider';

beforeEach(() => {
  fetch.mockResponse('{ "latestPrice": "123.45" }');
});

afterEach(() => {
  fetch.resetMocks();
});

test('should return stock price', () => {
  return new DataProvider()
    .getStockPrice('TEST')
    .then(lastTradePrice => {
      expect(lastTradePrice).toBe('123.45');
    });
});

test('should throw Error for missing stockSymbol', () => {
  expect(() => new DataProvider().getStockPrice()).toThrow();
});
