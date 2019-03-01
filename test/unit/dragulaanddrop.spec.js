/* global describe, beforeEach, afterEach, it, expect */
import {DragulaAndDrop} from '../../src/dragula-and-drop'
import {Options} from '../../src/options'

describe('the Dragula and Drop Custom Element', function () {
  beforeEach(function () {
    // these represent the bindings with defaultValues
    this.options = {
      revertOnSpill: true,
      targetClass: 'drop-target',
      sourceClass: 'drag-source',
      dragFn: (item, source) => {},
      dropFn: (item, target, source, sibling) => {},
      dragEndFn: (item) => {}
    }

    this.item = document.createElement('div')
    this.sibling = document.createElement('div')
    this.container = document.createElement('div')
    this.container.classList.add('drag-source')
    this.container.classList.add('drop-target')

    this.commentAnchor = document.createComment('anchor')

    this.container.appendChild(this.item)
    this.container.appendChild(this.sibling)
    this.container.appendChild(this.commentAnchor)

    document.body.appendChild(this.container)

    this.globalOptions = new Options()

    this.createDragula = () => {
      this.dragulaAndDrop = new DragulaAndDrop(this.globalOptions)
      Object.assign(this.dragulaAndDrop, this.options)
      this.dragulaAndDrop.bind()
    }
  })

  afterEach(function () {
    this.dragulaAndDrop.unbind()
    document.body.removeChild(this.container)
  })

  it('should use the isContainer function if it is bound', function () {
    // arrange
    let wasCalled = false
    this.options.isContainer = (argsObj) => {
      wasCalled = true
    }
    this.createDragula()

    // act
    this.dragulaAndDrop.dragula.options.isContainer(this.container)

    // assert
    expect(wasCalled).toBeTruthy()
  })

  it('should check copy-option correctly (boolean/true)', function () {
    this.options.copy = true
    this.createDragula()
    let isBoolean = this.dragulaAndDrop.dragula._isCopy(this.item, this.container)
    this.dragulaAndDrop.dragula.options.isContainer(this.container)

    // assert
    expect(isBoolean).toBeTruthy()
  })

  it('should check copy-option correctly (boolean/false)', function () {
    this.options.copy = false
    this.createDragula()
    let isBoolean = this.dragulaAndDrop.dragula._isCopy(this.item, this.container)
    this.dragulaAndDrop.dragula.options.isContainer(this.container)

    // assert
    expect(isBoolean).toBeFalsy()
  })

  it('should check copy-option correctly (function)', function () {
    this.options.copy = function (item, container) {
      //  can be empty
    }
    this.createDragula()
    let isBoolean = this.dragulaAndDrop.dragula._isCopy(this.item, this.container)
    this.dragulaAndDrop.dragula.options.isContainer(this.container)

    // assert
    expect(isBoolean).toBeFalsy()
  })

  it('should be able to determine container-ness from the classes if isContainer is not bound', function () {
    // arrange
    this.createDragula()
    let result = false

    // act
    let test = () => {
      result = this.dragulaAndDrop.dragula.options.isContainer(this.container)
    }

    // assert
    expect(test).not.toThrow()
    expect(result).toBeTruthy()
  })

  it('should use the moves function if it is bound', function () {
    // arrange
    let wasCalled = false
    this.options.moves = (argsObj) => {
      wasCalled = true
    }
    this.createDragula()

    // act
    this.dragulaAndDrop.dragula.options.moves(this.item)

    // assert
    expect(wasCalled).toBeTruthy()
  })

  it('should not throw is the moves function is not bound', function () {
    // arrange
    this.createDragula()

    // act
    let test = () => this.dragulaAndDrop.dragula.options.moves(this.item)

    // assert
    expect(test).not.toThrow()
  })

  it('should use the accepts function if it is bound', function () {
    // arrange
    let wasCalled = false
    this.options.accepts = (argsObj) => {
      wasCalled = true
    }
    this.createDragula()

    // act
    this.dragulaAndDrop.dragula.options.accepts(this.item)

    // assert
    expect(wasCalled).toBeTruthy()
  })

  it('should not throw is the accepts function is not bound', function () {
    // arrange
    this.createDragula()

    // act
    let test = () => {
      this.dragulaAndDrop.dragula.options.accepts(this.item)
    }

    // assert
    expect(test).not.toThrow()
  })
})
