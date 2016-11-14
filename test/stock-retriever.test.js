import test from 'ava';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';

import StockRetriever from '../src/stock-retriever';
import DataProvider from '../src/data-provider';
import UiProvider from '../src/ui-provider';

let stockRetriever;
let dataProvider;
let uiProvider;

test.beforeEach(() => {
  dataProvider = new DataProvider();
  uiProvider = new UiProvider();

  const response = `<?xml version="1.0" encoding="UTF-8"?>
<query><results><quote symbol="TEST"><LastTradePriceOnly>123.45</LastTradePriceOnly></quote></results></query>`;

  fetchMock.get('*', response);

  sinon.stub(dataProvider, 'getStockPrice', dataProvider.getStockPrice);

  sinon.stub(uiProvider, 'displayLoading');
  sinon.stub(uiProvider, 'getStockSymbol').returns('TEST');
  sinon.stub(uiProvider, 'init');
  sinon.stub(uiProvider, 'setStockPrice');

  stockRetriever = new StockRetriever(dataProvider, uiProvider);
});

test.afterEach(() => {
  fetchMock.restore();
});

test('init should call UiProvider init', t => {
  stockRetriever.init();

  t.true(uiProvider.init.calledOnce);
});

test('fetch should get stock symbol', t => {
  return stockRetriever.fetch().then(() => {
    t.true(uiProvider.getStockSymbol.calledOnce);
  });
});

test('fetch should display loading', t => {
  return stockRetriever.fetch().then(() => {
    t.true(uiProvider.displayLoading.calledOnce);
  });
});

test('fetch should get stock price', t => {
  return stockRetriever.fetch().then(() => {
    t.true(dataProvider.getStockPrice.calledWith('TEST'));
  });
});

test('fetch should update stock price information', t => {
  return stockRetriever.fetch().then(() => {
    t.true(uiProvider.setStockPrice.calledWith('TEST', '123.45'));
  });
});
