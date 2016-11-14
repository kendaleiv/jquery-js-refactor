import test from 'ava';
import sinon from 'sinon';

import UiProvider from '../src/ui-provider';

let uiProvider;
let selectors;

test.beforeEach(() => {
  uiProvider = new UiProvider();
  selectors = uiProvider.configuration.selectors;
});

test('init should create click handler on fetchButton selector', t => {
  sinon.stub(selectors.fetchButton, 'on');

  uiProvider.init();

  t.true(selectors.fetchButton.on.calledWith('click', sinon.match.func));
});

test('displayLoading should display loading for current stock price', t => {
  sinon.stub(selectors.currentStockPrice, 'html');

  uiProvider.displayLoading();

  t.true(selectors.currentStockPrice.html.calledWith('Loading ...'));
});

test('getStockSymbol should get stock symbol from DOM', t => {
  sinon.stub(selectors.stockSymbol, 'val').returns('GOOG');

  const stockSymbol = uiProvider.getStockSymbol();

  t.is(stockSymbol, 'GOOG');
});

test('getStockSymbol should toUpperCase stock symbol', t => {
  sinon.stub(selectors.stockSymbol, 'val').returns('goog');

  const stockSymbol = uiProvider.getStockSymbol();

  t.is(stockSymbol, 'GOOG');
});

test('getStockSymbol should trim stock symbol', t => {
  sinon.stub(selectors.stockSymbol, 'val').returns(' GOOG ');

  const stockSymbol = uiProvider.getStockSymbol();

  t.is(stockSymbol, 'GOOG');
});

test('setStockPrice should update current stock price', t => {
  sinon.stub(selectors.currentStockPrice, 'html');

  uiProvider.setStockPrice('GOOG', 1000.00);

  t.true(selectors.currentStockPrice.html.calledOnce);
});

test('setStockPrice should append stock price to log', t => {
  sinon.stub(selectors.stockPriceLog, 'html');

  uiProvider.setStockPrice('GOOG', 1000.00);

  t.true(selectors.stockPriceLog.html.calledTwice);
});
