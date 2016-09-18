import StockRetriever from './stock-retriever';
import DataProvider from './data-provider';
import UiProvider from './ui-provider';

new StockRetriever(new DataProvider(), new UiProvider())
  .init();
