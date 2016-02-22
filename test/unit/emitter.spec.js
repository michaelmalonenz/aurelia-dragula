import {Emitter} from '../../src/emitter';

describe('The Emitter', function() {

  beforeEach(function() {
    this.testEventType = 'testEvent';
    this.emitter = new Emitter();
  });

  it('should register for an event without throwing', function() {
    //act
    let test = () => this.emitter.on(this.testEventType, () => {});

    //assert
    expect(test).not.toThrow();
  });

  it('should call the callback registered on emit', function() {
    //arrange
    let callbackCalled = false;
    this.emitter.on(this.testEventType, () => {
      callbackCalled = true;
    });

    //act
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackCalled).toBeTruthy();
  });

  it('should call all callbacks registered for the event on emit', function() {
    //arrange
    let callbackOneCalled = false;
    let callbackTwoCalled = false;

    this.emitter.on(this.testEventType, () => {
      callbackOneCalled = true;
    });

    this.emitter.on(this.testEventType, () => {
      callbackTwoCalled = true;
    });

    //act
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackOneCalled).toBeTruthy();
    expect(callbackTwoCalled).toBeTruthy();
  });

  it('should pass the arugments supplied to the callback registered on emit', function() {
    //arrange
    let testObject1 = { testProp: 'this is not a test, this is Rock and Roll' };
    let testObject2 = { testPropTwo: 'actually, this is a test' };

    this.emitter.on(this.testEventType, (first, second) => {
      //assert
      expect(first).toBe(testObject1);
      expect(second).toBe(testObject2);
    });

    //act
    this.emitter.emit(this.testEventType, testObject1, testObject2);
  });

  it('should not call the callback registered on emit if deregistered specifically', function() {
    //arrange
    let callbackCalled = false;
    let fn = () => callbackCalled = true;
    this.emitter.on(this.testEventType, fn);

    //act
    this.emitter.off(this.testEventType, fn);
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackCalled).toBeFalsy();
  });

  it('should not call any callback registered on emit if deregistered generally', function() {
    //arrange
    let callbackOneCalled = false;
    let callbackTwoCalled = false;

    let fnOne = () => callbackOneCalled = true;
    let fnTwo = () => callbackTwoCalled = true;

    this.emitter.on(this.testEventType, fnOne);
    this.emitter.on(this.testEventType, fnTwo);

    //act
    this.emitter.off(this.testEventType);
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackOneCalled).toBeFalsy();
    expect(callbackTwoCalled).toBeFalsy();
  });

    it('should call the callback once if registered for once on emit', function() {
    //arrange
    let callbackCallCount = 0;
    this.emitter.once(this.testEventType, () => callbackCallCount++);

    //act
    this.emitter.emit(this.testEventType);
    this.emitter.emit(this.testEventType);
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackCallCount).toBe(1);
  });

  it('should be able to deregister handlers registerd via the once call', function() {
    //arrange
    let callbackCalled = false;
    let fn = () => callbackCalled = true;
    this.emitter.once(this.testEventType, fn);

    //act
    this.emitter.off(this.testEventType, fn);
    this.emitter.emit(this.testEventType);

    //assert
    expect(callbackCalled).toBeFalsy();
  });

});