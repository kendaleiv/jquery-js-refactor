import sinon from 'sinon';

import UiProvider from '../src/ui-provider';

let uiProvider;
let selectors;

beforeEach(() => {
  uiProvider = new UiProvider();
  selectors = uiProvider.configuration.selectors;
});

test('init should create click handler on fetchButton selector', () => {
  sinon.stub(selectors.fetchButton, 'on');

  uiProvider.init();

  expect(selectors.fetchButton.on.calledWith('click', sinon.match.func)).toBe(true);
});

test('displayLoading should display loading for current stock price', () => {
  sinon.stub(selectors.currentStockPrice, 'html');

  uiProvider.displayLoading();

  expect(selectors.currentStockPrice.html.calledWith('Loading ...')).toBe(true);
});

test('getStockSymbol should get stock symbol from DOM', () => {
  sinon.stub(selectors.stockSymbol, 'val').returns('GOOG');

  const stockSymbol = uiProvider.getStockSymbol();

  expect(stockSymbol).toBe('GOOG');
});

test('getStockSymbol should toUpperCase stock symbol', () => {
  sinon.stub(selectors.stockSymbol, 'val').returns('goog');

  const stockSymbol = uiProvider.getStockSymbol();

  expect(stockSymbol).toBe('GOOG');
});

test('getStockSymbol should trim stock symbol', () => {
  sinon.stub(selectors.stockSymbol, 'val').returns(' GOOG ');

  const stockSymbol = uiProvider.getStockSymbol();

  expect(stockSymbol).toBe('GOOG');
});

test('setStockPrice should update current stock price', () => {
  sinon.stub(selectors.currentStockPrice, 'html');

  uiProvider.setStockPrice('GOOG', 1000.00);

  expect(selectors.currentStockPrice.html.calledOnce).toBe(true);
});

test('setStockPrice should append stock price to log', () => {
  sinon.stub(selectors.stockPriceLog, 'html');

  uiProvider.setStockPrice('GOOG', 1000.00);

  expect(selectors.stockPriceLog.html.calledTwice).toBe(true);
});
