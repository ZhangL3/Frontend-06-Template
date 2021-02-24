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
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href></a>', function () {
    let tree = parseHTML('<a href></a>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href id></a>', function () {
    let tree = parseHTML('<a href id ></a>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="abc" id></a>', function () {
    let tree = parseHTML('<a href="abc" id></a>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href=abc id></a>', function () {
    let tree = parseHTML('<a href=abc id></a>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href=abc/>', function () {
    let tree = parseHTML('<a href=abc/>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href=\'abc\'/>', function () {
    let tree = parseHTML('<a href=\'abc\'/>');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  
  it('<a />', function () {
    let tree = parseHTML('<a />');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<A /> upper case', function () {
    let tree = parseHTML('<A />');
    // console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<>', function () {
    let tree = parseHTML('<>');
    console.log('tree: ', tree);
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].type, "text");
  });
})