import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender } from "./sender";
export class mainStage extends BaseStep {
	private txtChat: al.Label;
	private chat: string[];
	private chatIndex: number = 0;
	private xmlRoot: Element;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.xmlRoot = getSender();
				this.chat = [];
				for (var i = 0; i < this.xmlRoot.children.length; i++) {
					for (var j = 0; j < this.xmlRoot.children[i].attributes.length; j++) {
						const name = this.xmlRoot.children[i].attributes[j].name
						if (name == 'content') {
							this.chat.push(this.xmlRoot.children[i].attributes[j].value)
						}
					}
				}

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