import { Button } from "./button";
import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import { FlowEventName } from "./mainScene";

export class startStage extends BaseStep {
	private btnPlay: Button;
	private playClicked = false;
	private spriteTitle: g.Sprite;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				let scene = g.game.scene();
				//
				let bg = Helper.newSprite('/assets/back_living.png')
				scene.append(bg)
				this.spriteTitle = Helper.newSprite('/assets/title0.png')
				scene.append(this.spriteTitle)
				this.spriteTitle.x = g.game.width / 2 - this.spriteTitle.width / 2;
				this.spriteTitle.modified();
				let img = scene.asset.getImage('/assets/button_start.png')
				this.btnPlay = new Button(scene, img, 108, 553)
				this.btnPlay.onClick.add(() => {
					console.log('play clicked');
					this.playClicked = true;
				})
				scene.append(this.btnPlay)
				this.btnPlay.x = g.game.width / 2 - this.btnPlay.width / 2;
				this.btnPlay.y = g.game.height / 2 - this.btnPlay.height / 2 + 200;
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				if (this.playClicked == true) {
					this.playClicked = false;
					this.btnPlay.hide();
					this.spriteTitle.hide();
					this.runNext();
				} else {
					this.runThisNextFrame();
				}
				break;
		}
	}
}