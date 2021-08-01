import { Container, Sprite, Text, Texture } from 'pixi.js';
import { Vector2, M2 } from '../shared/Math'
import { Config } from '../shared/Config';
import { OutlineFilter } from '@pixi/filter-outline';
import { EventEmitter } from '@pixi/utils';

export default class Asteroid extends EventEmitter{
  static readonly DEFAULT_SPEED = 80;
  
  private static readonly _words: string[] = [
    'ընկնել',
    'տալ',
    'շփել',
    'արեւ',
    'երկինք',
    'սեր',
    'ցուրտ',
    'ցուրտ'
  ];

  private _sprite: Sprite;
  private _wholeText: Text;
  private _typedText: Text;
  private _speed: Vector2;
  private _target: Vector2;
  private _position: Vector2;
   
  constructor(word: string, target: Vector2) {
    super();
    this._sprite = new Sprite();
    this._sprite.filters = [new OutlineFilter(2, 0x99ff99)];
    this._sprite.anchor.set(0.5);
    this._sprite.scale.set(0.5 + 0.15 * word.length);
    this._wholeText = new Text(word, {
      fill: 0x00ff00,
      align: 'left'
    });
    this._typedText = new Text(word , {
      fill: 0xffffff,
      align: 'left'
    });
    this._typedText.anchor.set(1, 0);
    
    // placing the meteor
    let { width, height } = Config.ReferenceSize;
    
    this._target = target;
    this._position = new Vector2();
    this._position.set(M2.rand(0, width), height - 50);

    this._speed = new Vector2();
  }

  public static generate (target: Vector2) {
    let asteroids: Asteroid[] = [];
    for(let i = 0; i < 10; i++) {
      // make a new Asteroid with random word
      let asteroid = new Asteroid(Asteroid._words[M2.randint(0, Asteroid._words.length - 1)], target);
      asteroids.push(asteroid);
    }
    return asteroids;
  }

  get sprite() {
    return this._sprite;
  }

  get x() {
    return this._position.x;
  }

  get y() {
    return this._position.y;
  }

  get speed() {
    return this._speed;
  }

  set x(x: number) {
    this._position.x = x;
    this._sprite.x = x;
    this._wholeText.x = this._position.x - this._wholeText.width/2;
    this._typedText.x = this._position.x + this._wholeText.width/2;
  }

  set y(y: number) {
    this._position.y = y;
    this._sprite.y = y;
    this._wholeText.y = this._position.y - this._wholeText.height/2;
    this._typedText.y = this._position.y - this._wholeText.height/2;
  }

  public direct(): void {
    this._speed.set(this._target);
    this._speed.sub(this._position);
    this._speed.nor();
    this._speed.scl(Asteroid.DEFAULT_SPEED);
  }

  public bringTo(stage: Container) {
    stage.addChild(this._sprite);
    stage.addChild(this._wholeText);
    stage.addChild(this._typedText);
  }

  public damage() {
    if(this._typedText.text.length > 1) {
      this._typedText.text = this._typedText.text.substring(1, this._typedText.text.length);
      this._sprite.scale.set(this._sprite.scale.x * 0.9, this._sprite.scale.y * 0.9);
    } else {
      this.emit('destroyed');
      this._sprite.visible = false;
      this._wholeText.visible = false;
      this._typedText.visible = false;
    }
  }
}
