import {
  isMobile
} from "@pixi/utils";

export class Vector2 {
  private _x: number;
  private _y: number;

  constructor(x ? : number, y ? : number) {
    if (!x) {
      x = 0;
    }

    if (!y) {
      y = 0;
    }

    this._x = x;
    this._y = y;
  }

  add(vec: Vector2): Vector2;
  add(x: number, y: number): Vector2;
  add(xOrVec: number | Vector2, y ? : number): Vector2 {
    if (typeof xOrVec === 'number') {
      let x = xOrVec;
      this._x += x;
      this._y += y;
      return this;
    } else {
      let vec = xOrVec;
      this._x += vec.x;
      this._y += vec.y;
      return this;
    }
  }

  scl(vec: Vector2): Vector2;
  scl(scl: number): Vector2;
  scl(x: number, y: number): Vector2;
  scl(xOrVecOrScl: number | Vector2, y ? : number): Vector2 {
    if (typeof xOrVecOrScl === 'number') {
      let x = xOrVecOrScl;
      if (y === undefined) {
        y = x;
      }
      this._x *= x;
      this._y *= y;
      return this;
    } else {
      let vec = xOrVecOrScl;
      this._x += vec.x;
      this._y += vec.y;
      return this;
    }
  }

  set(vec: Vector2): Vector2;
  set(x: number, y: number): Vector2;
  set(xOrVec: number | Vector2, y ? : number): Vector2 {
    if (typeof xOrVec === 'number') {
      let x = xOrVec;
      this._x = x;
      this._y = y;
      return this;
    } else {
      let vec = xOrVec;
      this._x = vec.x;
      this._y = vec.y;
      return this;
    }
  }

  sub(vec: Vector2): Vector2;
  sub(x: number, y: number): Vector2;
  sub(xOrVec: number | Vector2, y ? : number): Vector2 {
    if (typeof xOrVec === 'number') {
      let x = xOrVec;
      this._x -= x;
      this._y -= y;
      return this;
    } else {
      let vec = xOrVec;
      this._x -= vec.x;
      this._y -= vec.y;
      return this;
    }
  }

  nor(): Vector2 {
    let len = this.len();
    if (len !== 0) {
      this._x /= len;
      this._y /= len;
    }
    return this;
  }

  len(): number {
    return Math.sqrt(this._x ** 2 + this._y ** 2);
  }

  get x() {
    return this._x;
  }

  set x(x: number) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y: number) {
    this._y = y;
  }
}


export class M2 {
  static AngleDist(a: number, b: number, deg: boolean = true) {
    const max = deg ? 360 : Math.PI * 2;
    const da = (b - a) % max;
    return 2 * da % max - da;
  }

  static clamp(val: number, left: number = 0, right: number = 1) {
    return Math.max(left, Math.min(right, val));
  }

  static Delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  static randKey(pair: {
    [key: string]: number
  }, def ? : string): string {
    const probs = pair;

    let scale = 1;
    let max = 0;
    if (!def) {
      scale = 0;
      for (let key in probs) {

        if (max < probs[key]) {
          max = probs[key];
          def = key;
        }

        scale += probs[key];
      }
    }

    let p = Math.random() * scale;

    for (let key in probs) {
      if (p < probs[key]) {
        return key as string;
      }
      p -= probs[key];
    }

    return def;
  }

  static randint(a: number, b ? : number) {
    if (b == undefined) {
      return Math.floor(M2.rand(a));
    } else {
      return Math.floor(M2.rand(b - a)) + a;
    }
  }
  static rand(a: number, b ? : number) {
    if (b == undefined) {
      return Math.random() * a;
    } else {
      return Math.random() * (b - a) + a;
    }
  }

  static get mobile() {
    return (isMobile as any).any;
  }
}
