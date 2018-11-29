/* global describe, it, expect */
import {Dragula} from '../../src/dragula'

describe('drake', function () {
  it('can be instantiated without throwing', function () {
    expect(() => new Dragula()).not.toThrow()
  })

  it('has expected api properties', function () {
    let drake = new Dragula()
    expect(drake).not.toEqual(null)
    expect(typeof drake).toBe('object')
    expect(Array.isArray(drake.containers)).toBeTruthy()
    expect(typeof drake.start).toBe('function')
    expect(typeof drake.end).toBe('function')
    expect(typeof drake.cancel).toBe('function')
    expect(typeof drake.remove).toBe('function')
    expect(typeof drake.destroy).toBe('function')
    expect(typeof drake.dragging).toBe('boolean')
    expect(drake.dragging).toBeFalsy()
  })
})
