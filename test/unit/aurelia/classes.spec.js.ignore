import * as classes from '../../src/classes';

describe('classes', function() {

  it('exports the expected api', function() {
    expect(typeof classes.add).toBe('function');
    expect(typeof classes.rm).toBe('function');
  });

  it('can add a class', function() {
    let el = document.createElement('div');
    classes.add(el, 'gu-foo');
    expect(el.className).toBe('gu-foo');
  });

  it('can add a class to an element that already has classes', function() {
    let el = document.createElement('div');
    el.className = 'bar';
    classes.add(el, 'gu-foo');
    expect(el.className).toBe('bar gu-foo');
  });

  it('add is a no-op if class already is in element', function() {
    let el = document.createElement('div');
    el.className = 'gu-foo';
    classes.add(el, 'gu-foo');
    expect(el.className).toBe('gu-foo');
  });

  it('can remove a class', function() {
    let el = document.createElement('div');
    el.className = 'gu-foo';
    classes.rm(el, 'gu-foo');
    expect(el.className).toBe('');
  });

  it('can remove a class from a list on the right', function() {
    let el = document.createElement('div');
    el.className = 'bar gu-foo';
    classes.rm(el, 'gu-foo');
    expect(el.className).toBe('bar');
  });

  it('can remove a class from a list on the left', function() {
    let el = document.createElement('div');
    el.className = 'gu-foo bar';
    classes.rm(el, 'gu-foo');
    expect(el.className).toBe('bar');
  });

  it('can remove a class from a list on the middle', function() {
    let el = document.createElement('div');
    el.className = 'foo gu-foo bar';
    classes.rm(el, 'gu-foo');
    expect(el.className).toBe('foo bar');
  });
});