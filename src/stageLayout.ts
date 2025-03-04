import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { Scene, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
export class layout {
	constructor() {
		const scene = g.game.scene()
		this.root = new g.E({
			scene: scene,
			parent: globalThis.gameLayer
		});
		this.background3 = this.newE(scene);
		this.background2 = this.newE(scene);
		this.background = this.newE(scene);
		this.message2 = this.newE(scene);
		this.message = this.newE(scene);
	}
	private newE(scene: g.Scene) {
		return new g.E({
			scene: scene,
			parent: this.root
		});
	}
	root: g.E;
	background: g.E;
	background2: g.E;
	background3: g.E;
	message: g.E;
	message2: g.E;
}
export class stageLayout extends BaseStep {
	private layout: layout;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.layout = new layout();
				setSender(this.layout);
				this.runNext();
				break;
		}
	}

}