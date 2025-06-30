type Observer<T> = (state: T) => void;

type SetFn<T> = (state: Readonly<T>) => Readonly<T>;

export class Observable<T> {
  private observers: Observer<Readonly<T>>[] = [];
  private state: Readonly<T>;
  private onSet: SetFn<T> = (state) => state;

  constructor(state: T, onSet?: SetFn<T>) {
    this.state = state;
    if (onSet !== undefined) {
      this.onSet = onSet;
    }
  }

  public get = () => this.state;

  public set = (newState: Readonly<T> | SetFn<Readonly<T>>) => {
    const state = Object.freeze(this.onSet(this.isFunction(newState) ? newState(this.state) : newState));

    if (state === this.state) {
      return this.state;
    }

    this.state = state;
    this.notify();
    return state;
  };

  public subscribe = (observer: Observer<Readonly<T>>) => {
    this.observers.push(observer);

    return () => this.unsubscribe(observer);
  };

  public unsubscribe = (observer: Observer<Readonly<T>>) => {
    this.observers = this.observers.filter((obs) => obs !== observer);
  };

  private notify = () => {
    for (const observer of this.observers) {
      observer(this.state);
    }
  };

  private isFunction = (value: Readonly<T> | SetFn<T>): value is SetFn<T> => typeof value === 'function';
}
