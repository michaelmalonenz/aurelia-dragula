/* global describe, it, expect */
import {Options, DIRECTION} from '../../src/options'
import {Dragula} from '../../src/dragula'

describe('drake defaults', () => {
  it('has sensible options', () => {
    let options = new Options()
    expect(typeof options.moves).toBe('function', 'options.moves defaults to a method')
    expect(typeof options.accepts).toBe('function')
    expect(typeof options.invalid).toBe('function')
    expect(typeof options.isContainer).toBe('function')
    expect(options.copy).toBe(false, 'copy')
    expect(options.revertOnSpill).toBe(true, 'revertOnSpill')
    expect(options.removeOnSpill).toBe(false, 'removeOnSpill')
    expect(options.direction).toBe('vertical', 'direction')
    expect(options.mirrorContainer).toBe(document.body, 'mirrorContainer')
  })

  it('still has sensible options when combined with dragula', () => {
    let options = new Options()
    let dragula = new Dragula(options)

    expect(typeof dragula.options.moves).toBe('function', 'dragula.moves defaults to a method')
    expect(typeof dragula.options.accepts).toBe('function')
    expect(typeof dragula.options.invalid).toBe('function')
    expect(typeof dragula.options.isContainer).toBe('function')
    expect(dragula.options.copy).toBe(false, 'copy')
    expect(dragula.options.revertOnSpill).toBe(true, 'revertOnSpill')
    expect(dragula.options.removeOnSpill).toBe(false, 'removeOnSpill')
    expect(dragula.options.direction).toBe('vertical', 'direction')
    expect(dragula.options.mirrorContainer).toBe(document.body, 'mirrorContainer')
  })

  it('combine with the supplied options correctly', function () {
    // arrange
    let div = document.createElement('div')
    let opposite = new Options()
    opposite.moves = Options.never
    opposite.accepts = Options.never
    opposite.invalid = Options.always
    opposite.containers = [div]
    opposite.isContainer = Options.always
    opposite.copy = true
    opposite.copySortSource = true
    opposite.revertOnSpill = true
    opposite.removeOnSpill = true
    opposite.direction = DIRECTION.HORIZONTAL
    opposite.ignoreInputTextSelection = false
    opposite.mirrorContainer = div

    // act
    let dragula = new Dragula(opposite)

    // assert
    expect(dragula.options.moves).toBe(Options.never)
    expect(dragula.options.accepts).toBe(Options.never)
    expect(dragula.options.invalid).toBe(Options.always)
    expect(dragula.options.containers).toEqual([div])
    expect(dragula.options.isContainer).toBe(Options.always)
    expect(dragula.options.copy).toBe(true)
    expect(dragula.options.copySortSource).toBe(true)
    expect(dragula.options.revertOnSpill).toBe(true)
    expect(dragula.options.removeOnSpill).toBe(true)
    expect(dragula.options.direction).toBe(DIRECTION.HORIZONTAL)
    expect(dragula.options.ignoreInputTextSelection).toBe(false)
    expect(dragula.options.mirrorContainer).toBe(div)
  })
})
