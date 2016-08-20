import test from 'ava';
import 'babel-core/register';

import jqueryJsRefactor from '../src/lib/';

test('jqueryJsRefactor', (t) => {
  t.is(jqueryJsRefactor(), true);
});
