import {createDragula} from '../lib/create-dragula';

describe('drake containers', function() {

  it('defaults to none', function() {
    let drake = createDragula();
    expect(Array.isArray(drake.containers)).toBeTruthy();
    expect(drake.containers.length).toBe(0);
  });

  it('reads containers from array argument', function() {
    let el = document.createElement('div');
    let containers = [el];
    let drake = createDragula(containers);
    expect(drake.containers).toEqual(containers);
    expect(drake.containers.length).toBe(1);
  });

  it('reads containers from array in options', function() {
    let el = document.createElement('div');
    let containers = [el];
    let drake = createDragula(containers);
    expect(drake.containers).toEqual(containers);
    expect(drake.containers.length).toBe(1);
  });

  it('should have containers in options take precedence', function() {
    let el = document.createElement('div');
    let containers = [el];
    let drake = createDragula(containers);
    expect(drake.containers).toEqual(containers);
    expect(drake.containers.length).toBe(1);
  });
});
