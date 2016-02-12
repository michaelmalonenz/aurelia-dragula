import {dragula} from '../../src/dragula';

describe('destroy', function() {
  beforeEach(function() {
    this.drake = dragula();
  })

  it('does not throw when not dragging, destroyed, or whatever when called once', function() {
    expect(this.drake.destroy).not.toThrow();
  });

  it('does not throw when not dragging, destroyed, or whatever when called multiple times', function() {
    let test = () => {
      this.drake.destroy();
      this.drake.destroy();
      this.drake.destroy();
      this.drake.destroy();
    };

    expect(test).not.toThrow();
  });
});

describe('destroy', function() {
    it('when dragging, DOM is left in tact', function() {
      //arrange
      let div = document.createElement('div');
      let item = document.createElement('div');
      let drake = dragula([div]);
      div.appendChild(item);
      document.body.appendChild(div);
      drake.start(item);

      //act
      drake.destroy();

      //assert
      expect(div.children.length).toBe(1);
      expect(drake.dragging).toBe(false);
    });

    it('when dragging and destroy gets called, dragend event is emitted gracefully', function() {
      let dragendCalled = false;
      let div = document.createElement('div');
      let item = document.createElement('div');
      let drake = dragula([div]);
      div.appendChild(item);
      document.body.appendChild(div);
      drake.on('dragend', dragend);
      drake.start(item);
      
      drake.destroy();

      expect(dragendCalled).toBeTruthy();

      function dragend () {
        dragendCalled = true;
      }
    });

    it('when dragging a copy and destroy gets called, default does not revert', function() {
      let dragendCalled = false;
      let div = document.createElement('div');
      let div2 = document.createElement('div');
      let item = document.createElement('div');
      let drake = dragula([div, div2]);
      div.appendChild(item);
      document.body.appendChild(div);
      document.body.appendChild(div2);
      drake.start(item);
      div2.appendChild(item);
      drake.on('drop', drop);
      drake.on('dragend', dragend);

      drake.destroy();

      expect(dragendCalled).toBeTruthy();

      function dragend () {
        dragendCalled = true;
      }
      function drop (target, parent, source) {
        expect(target).toBe(item);
        expect(parent).toBe(div2);
        expect(source).toBe(div);
      }
    });

    it('when dragging a copy and destroy gets called, revert is executed', function() {
      let dragendCalled = false;
      let div = document.createElement('div');
      let div2 = document.createElement('div');
      let item = document.createElement('div');
      let drake = dragula([div, div2], { revertOnSpill: true });
      div.appendChild(item);
      document.body.appendChild(div);
      document.body.appendChild(div2);
      drake.start(item);
      div2.appendChild(item);

      drake.on('cancel', cancel);
      drake.on('dragend', dragend);
      
      drake.destroy();

      expect(dragendCalled).toBeTruthy();

      function dragend () {
        dragendCalled = true;
      }
      function cancel (target, container) {
        expect(target).toBe(item);
        expect(container).toBe(div);
      }
    });
});
