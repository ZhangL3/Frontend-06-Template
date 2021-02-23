var assert = require('assert');

import { parseHTML } from '../src/parser';

describe("parse html:", function () {
  it('<a></a>', function () {
    let tree = parseHTML('<a></a>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children[0].tagName, "a");
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    console.log('tree: ', tree);
    assert.strictEqual(tree.children[0].tagName, "a");
    assert.strictEqual(tree.children[0].children.length, 0);
  });
})