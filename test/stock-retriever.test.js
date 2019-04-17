global.fetch = require('jest-fetch-mock');
import sinon from 'sinon';

import StockRetriever from '../src/stock-retriever';
import DataProvider from '../src/data-provider';
import UiProvider from '../src/ui-provider';

let stockRetriever;
let dataProvider;
let uiProvider;

beforeEach(() => {
  dataProvider = new DataProvider();
  uiProvider = new UiProvider();

  fetch.mockResponse('{ "latestPrice": "123.45" }');

  // sinon.stub(dataProvider, 'getStockPrice', dataProvider.getStockPrice);

  // sinon.stub(uiProvider, 'displayLoading');
  // sinon.stub(uiProvider, 'getStockSymbol').returns('TEST');
  // sinon.stub(uiProvider, 'init');
  // sinon.stub(uiProvider, 'setStockPrice');

  stockRetriever = new StockRetriever(dataProvider, uiProvider);
});

afterEach(() => {
  fetch.resetMocks();
});

test('init should call UiProvider init', () => {
  stockRetriever.init();

  expect(uiProvider.init.calledOnce).toBe(true);
});

test('fetch should get stock symbol', () => {
  return stockRetriever.fetch().then(() => {
    expect(uiProvider.getStockSymbol.calledOnce).toBe(true);
  });
});

test('fetch should display loading', () => {
  return stockRetriever.fetch().then(() => {
    expect(uiProvider.displayLoading.calledOnce).toBe(true);
  });
});

test('fetch should get stock price', () => {
  return stockRetriever.fetch().then(() => {
    expect(dataProvider.getStockPrice.calledWith('TEST')).toBe(true);
  });
});

test('fetch should update stock price information', () => {
  return stockRetriever.fetch().then(() => {
    expect(uiProvider.setStockPrice.calledWith('TEST', '123.45')).toBe(true);
  });
});
