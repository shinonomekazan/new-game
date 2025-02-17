import { FlowEventName } from "./flow/flowManager";
import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { TextAlign } from "@akashic/akashic-engine";

export class mainStage extends BaseStep {
	private txtChat: al.Label;
	private chat: string[];
	private chatIndex: number = 0;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.chat = [];
				this.chat.push('もうすぐ育休に入る')
				this.chat.push('赤ちゃんがやってくるのはとても楽しみだけど')
				this.chat.push('ここまで積み上げてきたキャリアはどうなるだろうか？')
				this.chat.push('初めての育児と仕事を両立できるだろうか？')
				this.chat.push('これから、どんな選択が必要になるのか？')
				this.chat.push('ちょっと覗いてみよう！！')
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				let scene = g.game.scene();
				let sprChatBg = Helper.newSprite9Slice('/assets/message_window.png',
					1142, 240,
					{ top: 10, bottom: 10, left: 10, right: 10 });
				scene.append(sprChatBg);
				this.align(sprChatBg, 0)
				this.txtChat = new al.Label({
					scene: scene,
					parent: sprChatBg,
					font: globalThis.font,
					fontSize: 30,
					width: 2000,
					textAlign: TextAlign.Left,
					lineBreak: true,
					widthAutoAdjust: true,
					text: '',
				})
				this.txtChat.text = this.chat[this.chatIndex];
				this.txtChat.x = 50;
				this.txtChat.y = 50;
				this.txtChat.invalidate()
				this.txtChat.modified()
				scene.onPointUpCapture.add(this.onPointUp, this);
				this.runNext();
				break;
		}

	}
	private onPointUp() {
		console.log('......x');
		this.chatIndex++;
		if (this.chatIndex < this.chat.length) {
			this.txtChat.text = this.chat[this.chatIndex];
			this.txtChat.invalidate()
		}
	}
	private align(e: g.E, offset: number) {
		const h = g.game.height;
		e.anchorY = 1;
		e.y = h;
		e.modified();
	}
}