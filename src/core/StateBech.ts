import {
  EventEmitter,
} from '@pixi/utils';

export default class StateBech < T > extends EventEmitter {
  private _current: T | undefined;

  private _before: T | undefined;

  public send(state: T): void {
    this._before = this._current;
    this._current = state;

    if (this._before) {
      this.emit('leave', this._before);
    }

    if (this._current) {
      this.emit('enter', this._current);
    }
  }

  public release(): void {
    this.removeAllListeners();
  }

  set current(state: T) {
    this.send(state);
  }

  get current(): T {
    return this._current;
  }

  get before(): T {
    return this._before;
  }
}
