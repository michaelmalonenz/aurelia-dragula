import {dragula} from '../../src/dragula';

describe('drake defaults', () => {

  it('has sensible options', () => {
    var options = {};
    dragula(options);
    expect(typeof options.moves).toBe('function', 'options.moves defaults to a method');
    expect(typeof options.accepts).toBe('function');
    expect(typeof options.invalid).toBe('function');
    expect(typeof options.isContainer).toBe('function');
    expect(options.copy).toBe(false);
    expect(options.revertOnSpill).toBe(false);
    expect(options.removeOnSpill).toBe(false);
    expect(options.direction).toBe('vertical');
    expect(options.mirrorContainer).toBe(document.body);
  });
});
