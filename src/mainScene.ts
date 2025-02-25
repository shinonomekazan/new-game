import { FlowManager } from "./flow/flowManager";
import { Flow } from "./flow/step";
import { mainStage } from "./mainStage";
import { startStage } from "./startStage";
export enum FlowEventName {
	Test,
	GameLoad,
	GotoMainStage
}
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
	private onGameUpdate() {
		this.flowManger.onUpdate();
	}
	private onGameLoad() {
		this.flowManger = new FlowManager();
		let uiMainStageStep = new mainStage();
		let uiMainMenuStep = new startStage();
		//FlowEventName.GameLoad
		let flowLoad = new Flow(FlowEventName.GameLoad);
		flowLoad.steps.push(uiMainStageStep)
		flowLoad.steps.push(uiMainMenuStep)
		this.flowManger.addFlow(flowLoad);
		//FlowEventName.Test
		let flowTest = new Flow(FlowEventName.Test);
		this.flowManger.addFlow(flowTest);
		//FlowEventName.GotoMainStage
		let flowGotoMainStage = new Flow(FlowEventName.GotoMainStage);
		flowGotoMainStage.steps.push(uiMainMenuStep);
		flowGotoMainStage.steps.push(uiMainStageStep);
		this.flowManger.addFlow(flowGotoMainStage);
		//
		this.flowManger.fire(FlowEventName.GameLoad);
		this.flowManger.fire(FlowEventName.GotoMainStage);
	}

}