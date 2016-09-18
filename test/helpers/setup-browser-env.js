// https://github.com/avajs/ava/blob/20ab39de046e527dec7b369f375d6c8e5fd4f5e1/docs/recipes/browser-testing.md#setup-jsdom

global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
