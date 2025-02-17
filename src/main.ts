import { Scene } from "@akashic/akashic-engine";
import { MainScene } from "./mainScene";

declare global {
	var font: g.DynamicFont
}
async function main(param: g.GameMainParameterObject): Promise<void> {
	console.log(param);
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
	//g.game.scenes.push(scene)
	//g.game.replaceScene(scene)
	g.game.pushScene(scene)
}

export = main;