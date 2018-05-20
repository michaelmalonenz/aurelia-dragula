/* global describe, beforeEach, afterEach, it, expect, spyOn */
import {createDragula} from './lib/create-dragula'
import {raise} from './lib/events'
import {Util} from '../../src/util'

describe('cancel does not throw when not dragging', function () {
  beforeEach(function () {
    this.source = document.createElement('div')
    this.item = document.createElement('div')
    this.item.classList.add('item')
    this.drake = createDragula([this.source], { copy: true, copySortSource: true })
    this.source.appendChild(this.item)
    document.body.appendChild(this.source)
  })

  afterEach(function () {
    this.source.remove()
    this.clone = null
  })

  it('should not leave a copy lying around when sorting', function () {
    // arrange
    spyOn(Util, 'getElementBehindPoint').and.returnValue(this.source)
    this.drake.manualStart(this.item)

    // act
    raise(this.source, 'mouseup', {})

    // assert
    expect(document.contains(this.item)).toBeFalsy()
  })
})
