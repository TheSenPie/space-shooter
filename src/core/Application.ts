import { utils, Container, Ticker, Loader, Renderer, Rectangle, settings, SCALE_MODES, } from 'pixi.js';
import { IScene } from './IScene';

export interface ApplicationOptions {
	autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  autoDensity?: boolean;
  antialias?: boolean;
  resolution?: number;
  preserveDrawingBuffer?: boolean;
  clearBeforeRender?: boolean;
	forceFXAA?: boolean;
  backgroundColor?: number;
  backgroundAlpha?: number;
  powerPreference?: WebGLPowerPreference;
  resizeTo?: Window | HTMLElement;
}

export class Application extends utils.EventEmitter {
    public renderer: Renderer;

    public ticker: Ticker = new Ticker();

    public stage: Container = new Container();

    public loader: Loader = new Loader();

    constructor(options: ApplicationOptions) {
      super();
      this.renderer = new Renderer(options);
      this.renderer.plugins.interaction.moveWhenInside = true;
      settings.SCALE_MODE = SCALE_MODES.NEAREST;
      if (options.autoStart) {
        this.ticker.start();
      }
    }

    get view(): HTMLCanvasElement {
      return this.renderer.view;
    }

    get width(): number {
      return this.size.width;
    }

    get height(): number {
      return this.size.height;
    }

    get size(): Rectangle {
      return this.renderer.screen;
    }

    render(): void {
      this.renderer.render(this.stage);
    }

    start(game?: IScene): void {
      this.ticker.start();
    }

    stop(): void {
      this.ticker.stop();
    }

    destory(params = { children: false }): void {
      this.stage.destroy(params);
      this.ticker.destroy();
      this.renderer.destroy(true);
    }
}
