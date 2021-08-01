import * as PIXI from 'pixi.js';

import { Application } from "./core/Application";
import { IScene } from "./core/IScene";
import { Config } from './shared/Config';

import  TWEEN from "@tweenjs/tween.js";
import StateBech from './core/StateBech';
import SpaceShooter from './game/SpaceShooter';
import { scaleToWindow } from './shared/Responsive';

export class App extends Application {
	static instance: App;

	public games: {[key: string]: IScene};
	
	private state: StateBech<IScene>;

	constructor(parent: HTMLElement) {
		if(!parent) {
			throw new Error("aprent element must be div!");
		}
			
		const size = { ...Config.ReferenceSize };

		//fallback
		PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;

		let backgroundColor = 0x003b59;

		super({
			autoStart: false,
			powerPreference: "low-power",
			backgroundColor: backgroundColor,
			...size
		});

		parent.appendChild(this.view);

		// make ad responsive to the screen
    scaleToWindow(this.view, backgroundColor);
    window.addEventListener("resize", _ => {
      scaleToWindow(this.view, backgroundColor);
    });
		
		this.state = new StateBech();

		this.ticker.add(this.update, this);

		if (Config.PausedInBackground) {
			window.addEventListener("blur", () => {
				this.pause();
			});

			window.addEventListener("focus", () => {
				this.resume();
			});
		}

		this.render();

		//@ts-ignore
		window.AppInstance = this;
		App.instance = this;
	}

 	async load() {
		this.games = {};
		
		this.games.spaceshooter = new SpaceShooter(this);

		this.loader =  new PIXI.Loader(Config.BaseResDir);
		
		const start = performance.now();

		// pre load the assets for the game
		await new Promise((res) => {
			this.games.spaceshooter.preload(this.loader).load(res)
		});

		console.log("loading:", performance.now() - start);

		this.start(this.games.spaceshooter);
	}

	public start(game: IScene): void {
		this.state.current = game;
		this.state.current.init();

		this.stage.addChildAt(this.state.current.stage, 0);
		this.state.current.start();
		this.resume();
		super.start();
	}

	stop() {
		if (this.state.current) {
			this.stage.removeChild(this.state.current.stage);
			this.state.current.stop();
		}
		this.state.current = undefined;
		super.render();
		super.stop();
	}

	pause() {
		this.ticker.stop();
		if (this.state.current) {
			this.state.current.pause(false);
		}
		
		this.update();
	}

	resume() {
		if (!this.state.current) return;

		this.state.current.resume(false);
		super.start();
	}

	private update() {
		TWEEN.update(this.ticker.lastTime);
		if (this.state.current != null) {
			this.state.current.update(this.ticker);
		}

		this.render();
	}
}

window.onload = function() {
	//@ts-ignore
	const app = window.App = new App(document.body);
	app.load();
}