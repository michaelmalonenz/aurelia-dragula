import {Options} from '../../../src/aurelia/options';
import {Dragula} from '../../../src/aurelia/dragula';


describe('drake defaults', () => {

  it('has sensible options', () => {
    let options = new Options();
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

  xit('still has sensible options when combined with dragula', () => {
    let options = new Options();
    let dragula = new Dragula(options);

    expect(typeof dragula.moves).toBe('function', 'dragula.moves defaults to a method');
    expect(typeof dragula.accepts).toBe('function');
    expect(typeof dragula.invalid).toBe('function');
    expect(typeof dragula.isContainer).toBe('function');
    expect(dragula.copy).toBe(false);
    expect(dragula.revertOnSpill).toBe(false);
    expect(dragula.removeOnSpill).toBe(false);
    expect(dragula.direction).toBe('vertical');
    expect(dragula.mirrorContainer).toBe(document.body);
  });
});
