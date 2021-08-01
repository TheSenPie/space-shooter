import { Container } from '@pixi/display';
import { AnimatedSprite, Loader, Rectangle, Sprite, Texture, Ticker, TilingSprite } from 'pixi.js'
import { IScene } from '../core/IScene';
import StateBech from '../core/StateBech';
import { App } from '../index'
import { Config } from '../shared/Config';
import { M2, Vector2 } from '../shared/Math';
import Asteroid from './Asteroid';
import Spaceship from './Spaceship';

export default class SpaceShooter implements IScene  {
  kind: 'scene';

	stage: Container;
	loader: Loader;
	app: App;
	gameState: StateBech<Container>;

  // game variables
  bg: TilingSprite;
  bgAsteroids: Sprite[];
  spaceship: Spaceship;
  asteroids: Asteroid[];
  

  constructor (app: App) {
    this.app = app;
  }

  preload(loader?: Loader): Loader {
    this.loader = loader;
    loader
      .add([
        {name: 'bg', url: 'core/bg.png'},
        {name: 'spaceships', url: 'core/spaceships.png'},
        {name: 'spaceship-lights', url: 'core/spaceship_lights.png'},
        {name: 'asteroids-bg', url: 'core/asteroids_bg.png'},
        {name: 'asteroids', url: 'core/asteroids.png'}
        // {name: 'bg-meteor', url: ''}
        // {name: 'bg', url: 'core/bg.png'},
      ])
    return this.loader;
  }

  init(): void {
    this.stage = new Container();
    
    // add the background
    const {width, height} = Config.ReferenceSize;
    let bg_texture = this.loader.resources['bg'].texture;
    bg_texture.frame = new Rectangle(0, 0, 64, 64);
    this.bg = new TilingSprite(bg_texture, width, height);
    this.bg.tileScale.x = 2;
    this.bg.tileScale.y = 2;
    this.stage.addChild(this.bg);

    // add background asteroids
    this.bgAsteroids = [];
    let bg_asteroids_texture = this.loader.resources['asteroids-bg'].texture;
    let bg_asteroids_textures = [];
    
    // get independent textures from the spriteshet
    for(let i = 0; i < 4; i++) {
      let texture = new Texture(bg_asteroids_texture.baseTexture);
      texture.frame = new Rectangle(i * 64, 0, 64, 64);
      bg_asteroids_textures.push(texture);
    }
    
    for(let i = 0; i < 5; i++) {
      let sprite = new Sprite(bg_asteroids_textures[M2.randint(0, 3)]);
      sprite.anchor.set(0.5);
      sprite.x = M2.rand(sprite.width, width - sprite.width);
      sprite.y = M2.rand(sprite.height, height - sprite.height);
      sprite.angle = M2.rand(0, 360);
      sprite.scale.set(M2.rand(1.5, 3));
      this.bgAsteroids.push(sprite);
      this.stage.addChild(sprite);
    }
    
    // add the spaceshipt
    this.spaceship = new Spaceship(this.loader);
    this.stage.addChild(this.spaceship.sprite);
    this.stage.addChild(this.spaceship.lights);

    // add the main asteroids
    this.asteroids = Asteroid.generate(new Vector2(this.spaceship.sprite.x, this.spaceship.sprite.y));
    let asteroids_texture = this.loader.resources['asteroids'].texture;
    let asteroids_textures = [];
    
    // get independent textures from the spriteshet
    for(let i = 0; i < 4; i++) {
      let texture = new Texture(asteroids_texture.baseTexture);
      texture.frame = new Rectangle(i * 64, 0, 64, 64);
      asteroids_textures.push(texture);
    }

    for(let i = 0; i <= this.asteroids.length - 1; i++) {
      let asteroid = this.asteroids[i];
      let sprite = asteroid.sprite;
      sprite.texture = asteroids_textures[M2.randint(0, 3)];
      sprite.scale.set(M2.rand(1.2, 2));
      asteroid.x = M2.rand(-100 + sprite.width, width - sprite.width + 100);
      asteroid.y = -sprite.height - 60*i;
      asteroid.direct();
      asteroid.bringTo(this.stage);
      sprite.angle = M2.rand(0, 360);
      asteroid.on('destroyed', () => {
        this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
      })
    }
  }
  
  start(): void {
    document.addEventListener('keydown', () => {
      this.asteroids[0].damage();
    }); 
  }

  resume(soft: boolean): void {
    
  }
	
  pause(soft: boolean): void {

  }

  
  stop(): void {

  }
	
  update(ticker: Ticker): void {
    const dt = ticker.elapsedMS / 1000;
    let {width, height} = Config.ReferenceSize;
    
    this.bg.tilePosition.y += dt * 30;

    // move background asteroids downwards
    for(let i = 0; i <= this.bgAsteroids.length - 1; i++) {
      let sprite = this.bgAsteroids[i];
      sprite.y += dt * 60;
      sprite.angle += M2.rand(0, 0.3);
      if(sprite.y - sprite.width / 2 > height) {
        sprite.y = -sprite.height - 10;
        sprite.x = M2.rand(sprite.width, width - sprite.width);
        sprite.scale.set(M2.rand(1.5, 3));
      }
    }

    // move asteroids downwards
    for(let i = 0; i <= this.asteroids.length - 1; i++) {
      let asteroid = this.asteroids[i];
      asteroid.x += asteroid.speed.x * dt;
      asteroid.y += asteroid.speed.y * dt;
      asteroid.sprite.angle += M2.rand(0, 0.3);
    }
  }
}
