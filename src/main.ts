import { Scene } from "@akashic/akashic-engine";
import { MainScene } from "./mainScene";

declare global {
	var font: g.DynamicFont
	var gameLayer: g.E
	var debugLayer: g.E
	var debugMode: boolean
}
async function main(param: g.GameMainParameterObject): Promise<void> {
	//console.log(param);
	globalThis.debugMode = true;
	globalThis.font = new g.DynamicFont({
		game: g.game,
		fontFamily: "M PLUS 1",
		size: 60,
		fontWeight: "bold",
	});
	let scene = new MainScene({
		game: g.game,
		name: 'mainscene'
	});
	globalThis.gameLayer = new g.E({
		scene: scene,
		parent: scene
	})
	globalThis.debugLayer = new g.E({
		scene: scene,
		parent: scene
	})
	//g.game.scenes.push(scene)
	//g.game.replaceScene(scene)
	g.game.pushScene(scene)
}

export = main;