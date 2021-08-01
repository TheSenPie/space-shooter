import { Tween } from "@tweenjs/tween.js";
import { Sprite, Loader, Rectangle } from "pixi.js";
import { Config } from "../shared/Config";

export default class Spaceship {
  sprite: Sprite;
  lights: Sprite;
  loader: Loader;
  
  private _health: number = 3;
  private _invincible: boolean = false;

  constructor(loader: Loader) {
    this.loader = loader;

    let { width, height } = Config.ReferenceSize;
    let texture = this.loader.resources['spaceships'].texture;
    texture.frame = new Rectangle(256, 0, 64, 64);
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(1.5);
    this.sprite.rotation = 3* Math.PI/2;
    this.sprite.position.set(
      width/2,
      height - this.sprite.height/2 - 10
    );

      let lights_texture = this.loader.resources['spaceship-lights'].texture;
      lights_texture.frame = new Rectangle(256, 0, 64, 64);
      this.lights = new Sprite(lights_texture);
      this.lights.anchor.set(0.5);
      this.lights.scale.set(1.5);
      this.lights.rotation = 3* Math.PI/2;
      this.lights.position.set(
        this.sprite.x,
        this.sprite.y
      );
      new Tween(this.lights).to({alpha: 0}).repeat(Infinity).yoyo(true).start();
  }

  public takeDamage() {
    if(!this._invincible) {
      this._invincible = true;
    }
  }
}