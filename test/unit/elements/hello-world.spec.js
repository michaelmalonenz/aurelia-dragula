import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('hello-world element', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('says hello world with message', done => {
    let model = {message: 'from me'};

    component = StageComponent
      .withResources('elements/hello-world')
      .inView('<hello-world message.bind="message"></hello-world>')
      .boundTo(model);

    component.create(bootstrap).then(() => {
      const view = component.element;
      expect(view.textContent.trim()).toBe('Hello world from me');
      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
