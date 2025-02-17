import { FlowEventName, FlowManager } from "./flow/flowManager";

export class MainScene extends g.Scene {
	private flowManger: FlowManager;
	constructor(param: g.SceneParameterObject) {
		param.assetPaths = [
			"/assets/back_living.png",
			"/assets/title0.png",
			"/assets/button_start.png",
			"/assets/message_window.png",
		];
		super(param);
		this.onLoad.add(this.onGameLoad, this);
		this.onUpdate.add(this.onGameUpdate, this);
	}
	private onGameLoad() {
		this.flowManger = new FlowManager();
		this.flowManger.setupFlow();
		this.flowManger.fireLoop(FlowEventName.GameLoad);
		this.flowManger.fireLoop(FlowEventName.GotoMainStage);
		//this.onPointDownCapture.add(e => {
		//	console.log('click...');
		//	this.flowManger.fireLoop(FlowEventName.Test);
		//})
	}
	private onGameUpdate() {
		//console.log('onupdateee,');
		this.flowManger.onUpdate();
	}
}