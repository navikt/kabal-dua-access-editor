import { describe, expect, it, mock } from 'bun:test';
import { Observable } from '@/lib/observable/observable';

describe('Observable', () => {
  it('should create an observable with initial value', () => {
    const observable = new Observable<number>(0);
    expect(observable.get()).toBe(0);
  });

  it('should update when set() is called with a new value', () => {
    const observable = new Observable<number>(0);
    observable.set(42);
    expect(observable.get()).toBe(42);
  });

  it('should call listeners when set() is called with a new value', () => {
    const observable = new Observable<number>(0);
    const listener = mock();

    observable.subscribe(listener);
    observable.set(42);

    expect(listener).toHaveBeenCalledWith(42);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should not call unsubscribed listeners', () => {
    const observable = new Observable<number>(0);

    const subscribed = mock();
    observable.subscribe(subscribed);

    const unsubscribed = mock();
    const unsubscribe = observable.subscribe(unsubscribed);
    unsubscribe();

    observable.set(42);

    expect(subscribed).toHaveBeenCalledWith(42);
    expect(subscribed).toHaveBeenCalledTimes(1);
    expect(unsubscribed).not.toHaveBeenCalled();
  });

  it('should not call listeners when set() is called with the same value', () => {
    const observable = new Observable<number>(0);
    const listener = mock();

    observable.subscribe(listener);
    observable.set(0); // Same value

    expect(listener).not.toHaveBeenCalled();
  });
});
