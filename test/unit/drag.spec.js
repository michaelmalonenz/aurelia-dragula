/* global describe, beforeEach, afterEach, it, expect, fail */
import {createDragula} from './lib/create-dragula'
import {Options} from '../../src/options'
import {raise} from './lib/events'

describe('drag', function () {
  beforeEach(function () {
    this.always = () => true
    this.never = () => false

    this.initialContainers = []
    this.createDrake = () => {
      this.drake = createDragula(this.initialContainers)
    }
  })

  afterEach(function () {
    if (this.drake) {
      this.drake.destroy()
    }
  })

  it('drag event gets emitted when clicking an item', function () {
    testCase('works for left clicks', { which: 1 })
    testCase('works for wheel clicks', { which: 1 })
    testCase('works when clicking buttons by default', { which: 1 }, { tag: 'button', passes: true })
    testCase('works when clicking anchors by default', { which: 1 }, { tag: 'a', passes: true })
    testCase('fails for right clicks', { which: 2 }, { passes: false })
    testCase('fails for meta-clicks', { which: 1, metaKey: true }, { passes: false })
    testCase('fails for ctrl-clicks', { which: 1, ctrlKey: true }, { passes: false })
    testCase('fails when clicking containers', { which: 1 }, { containerClick: true, passes: false })
    testCase('fails whenever invalid returns true', { which: 1 }, { passes: false, dragulaOpts: { invalid: this.always } })
    testCase('fails whenever moves returns false', { which: 1 }, { passes: false, dragulaOpts: { moves: this.never } })

    function testCase (desc, eventOptions, options) {
      let o = options || {}
      let div = document.createElement('div')
      let item = document.createElement(o.tag || 'div')
      let passes = o.passes !== false
      let opts = Object.assign(new Options(), o.dragulaOpts)
      let drake = createDragula([div], opts)

      div.appendChild(item)
      document.body.appendChild(div)

      drake.on('drag', drag)

      raise(o.containerClick ? div : item, 'mousedown', eventOptions)
      raise(o.containerClick ? div : item, 'mousemove')

      expect(drake.dragging).toBe(passes, desc + ': final state is drake is ' + (passes ? '' : 'not ') + 'dragging')

      function drag (target, container) {
        if (!passes) {
          fail(`${desc}: drag event was emitted synchronously`)
        }
        expect(target).toBe(item, desc + ': first argument is selected item')
        expect(container).toBe(div, desc + ': second argument is container')
      }
    }
  })

  it('when already dragging, mousedown/mousemove ends (cancels) previous drag', function () {
    let div = document.createElement('div')
    let item1 = document.createElement('div')
    item1.classList.add('test')
    let item2 = document.createElement('div')
    this.initialContainers.push(div)

    this.createDrake()

    div.appendChild(item1)
    div.appendChild(item2)

    document.body.appendChild(div)

    this.drake.manualStart(item1)

    this.drake.on('dragend', (item) => {
      expect(item).toBe(item1, 'dragend invoked with correct item')
    })
    this.drake.on('cancel', (item, source) => {
      expect(item).toEqual(item1, 'cancel invoked with correct item')
      expect(source).toBe(div, 'cancel invoked with correct source')
    })
    this.drake.on('drag', (item, container) => {
      expect(item).toBe(item2, 'first argument is selected item')
      expect(container).toBe(div, 'second argument is container')
    })

    raise(item2, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item2, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(this.drake.dragging).toBe(true, 'final state of drake is dragging')
  })

  it('when already dragged, ends (drops) previous drag', function () {
    let div = document.createElement('div')
    let div2 = document.createElement('div')
    let item1 = document.createElement('div')
    let item2 = document.createElement('div')
    let drake = createDragula([div, div2])
    div.appendChild(item1)
    div.appendChild(item2)
    document.body.appendChild(div)
    document.body.appendChild(div2)

    drake.manualStart(item1)

    div2.appendChild(item1)

    drake.on('dragend', end)
    drake.on('drop', drop)
    drake.on('drag', drag)

    raise(item2, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item2, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(drake.dragging).toBe(true, 'final state is drake is dragging')

    function end (item) {
      expect(item).toBe(item1, 'dragend invoked with correct item')
    }
    function drop (item, target, source) {
      expect(item).toBe(item1, 'drop invoked with correct item')
      expect(source).toBe(div, 'drop invoked with correct source')
      expect(target).toBe(div2, 'drop invoked with correct target')
    }
    function drag (item, container) {
      expect(item).toBe(item2, 'first argument is selected item')
      expect(container).toBe(div, 'second argument is container')
    }
  })

  it('when copying, emits cloned with the copy', function () {
    let div = document.createElement('div')
    let item1 = document.createElement('div')
    let item2 = document.createElement('span')
    let drake = createDragula([div], { copy: true })
    item2.innerHTML = '<em>the force is <strong>with this one</strong></em>'
    div.appendChild(item1)
    div.appendChild(item2)
    document.body.appendChild(div)

    drake.manualStart(item1)

    drake.on('cloned', cloned)
    drake.on('drag', drag)

    raise(item2, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item2, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(drake.dragging).toBe(true, 'final state is drake is dragging')

    function cloned (copy, item) {
      expect(copy).not.toBe(item2, 'first argument is not exactly the target')
      expect(copy.tagName).toBe(item2.tagName, 'first argument has same tag as target')
      expect(copy.innerHTML).toBe(item2.innerHTML, 'first argument has same inner html as target')
      expect(item).toBe(item2, 'second argument is clicked item')
    }
    function drag (item, container) {
      expect(item).toBe(item2, 'first argument is selected item')
      expect(container).toBe(div, 'second argument is container')
    }
  })

  it('when dragging, element gets gu-transit class', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    createDragula([div])
    div.appendChild(item)
    document.body.appendChild(div)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(item.className).toBe('gu-transit', 'item should have gu-transit class')
  })

  it('when dragging, body gets gu-unselectable class', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    createDragula([div])
    div.appendChild(item)
    document.body.appendChild(div)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(document.body.className).toBe('gu-unselectable', 'body has gu-unselectable class')
  })

  it('when dragging, source radio inputs retain their checked attribute', function () {
    var div = document.createElement('div')
    var item = document.createElement('div')
    var drake = createDragula([div])
    item.innerHTML = '<em><input type=radio name=foo checked /></em>'
    div.appendChild(item)
    document.body.appendChild(div)
    drake.on('cloned', cloned)
    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })
    function cloned (mirror) {
      expect(item.getElementsByTagName('input')[0].checked).toBeTruthy()
      expect(mirror.getElementsByTagName('input')[0].checked).toBeTruthy()
    }
  })

  it('when dragging, element gets a mirror image for show', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    let drake = createDragula([div])
    item.innerHTML = '<em>the force is <strong>with this one</strong></em>'
    div.appendChild(item)
    document.body.appendChild(div)

    drake.on('cloned', cloned)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    function cloned (mirror, target) {
      expect(item.className).toBe('gu-transit', 'item does not have gu-mirror class')
      expect(mirror.className).toBe('gu-mirror', 'mirror only has gu-mirror class')
      expect(mirror.innerHTML).toBe(item.innerHTML, 'mirror is passed to \'cloned\' event')
      expect(target).toBe(item, 'cloned lets you know that the mirror is a clone of `item`')
    }
  })

  it('when dragging, mirror element gets appended to configured mirrorContainer', function () {
    let mirrorContainer = document.createElement('div')
    let div = document.createElement('div')
    let item = document.createElement('div')

    let drake = createDragula([div], {
      'mirrorContainer': mirrorContainer
    })

    item.innerHTML = '<em>the force is <strong>with this one</strong></em>'
    div.appendChild(item)
    document.body.appendChild(div)

    drake.on('cloned', cloned)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    function cloned (mirror) {
      expect(mirror.parentNode).toBe(mirrorContainer, 'mirrors parent is the configured mirrorContainer')
    }
  })

  it('when dragging stops, element gets gu-transit class removed', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    let drake = createDragula([div])
    div.appendChild(item)
    document.body.appendChild(div)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(item.className).toBe('gu-transit', 'item has gu-transit class')

    drake.end()

    expect(item.className).toBe('', 'item has gu-transit class removed')
  })

  it('when dragging stops, body becomes selectable again', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    let drake = createDragula([div])
    div.appendChild(item)
    document.body.appendChild(div)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    expect(document.body.className).toBe('gu-unselectable', 'body has gu-unselectable class')

    drake.end()

    expect(document.body.className).toBe('', 'body got gu-unselectable class removed')
  })

  it('when drag begins, check for copy option', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    item.className = 'copyable'
    div.className = 'contains'
    let drake = createDragula([div], {
      copy: checkCondition
    })
    item.innerHTML = '<em>the force is <strong>with this one</strong></em>'
    div.appendChild(item)
    document.body.appendChild(div)

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })
    // ensure the copy method condition is only asserted once
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })

    function checkCondition (el, source) {
      expect(el.className).toBe('copyable', 'dragged element classname is copyable')
      expect(source.className).toBe('contains', 'source container classname is contains')
      return true
    }
    drake.end()
  })

  it('when dragging begins, drop should not be called', function () {
    let div = document.createElement('div')
    let item = document.createElement('div')
    let drake = createDragula([div])
    div.appendChild(item)
    document.body.appendChild(div)

    drake.on('drop', () => fail())

    raise(item, 'mousedown', { which: 1, clientX: 10, clientY: 10 })
    raise(item, 'mousemove', { which: 1, clientX: 15, clientY: 15 })
  })
})
