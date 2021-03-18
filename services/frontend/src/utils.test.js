import * as utils from './utils';

test('setPrerenderReady', () => {
  expect(window.prerenderReady).toBeFalsy();
  utils.setPrerenderReady(true);
  expect(window.prerenderReady).toBeTruthy();
});
