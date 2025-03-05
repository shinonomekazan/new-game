import { background } from "./background";
import { chara } from "./chara";
import { fadeScreen } from "./fadeScreen";
import { FlowManager } from "./flow/flowManager";
import { Flow } from "./flow/step";
import { loadData } from "./loadData";
import { mainStage } from "./mainStage";
import { messageWindow } from "./messageWindow";
import { initialSender } from "./sender";
import { stageLayout } from "./stageLayout";
import { startStage } from "./startStage";
export enum FlowEventName {
	Test,
	GameLoad,
	GotoMainStage,
	Action,
	ActionComplete,
}
export class MainScene extends g.Scene {
	private flowManger: FlowManager;
	constructor(param: g.SceneParameterObject) {
		param.assetPaths = [
			"/assets/fire.png",
			"/assets/fire-gray.png",
			"/assets/back_living.png",
			"/assets/title0.png",
			"/assets/button_start.png",
			"/assets/btn-mess-next.png",
			"/assets/message_window.png",
			"/assets/white.png",
			"/assets/data.xml",
			"/assets/test/standing.png",
			"/assets/test/standing2.png",

		];
		super(param);
		this.onLoad.add(this.onGameLoad, this);
		this.onUpdate.add(this.onGameUpdate, this);
	}
	private onGameUpdate() {
		this.flowManger.onUpdate();
	}
	private onGameLoad() {
		initialSender();
		this.flowManger = new FlowManager();
		let _mainStageStep = new mainStage();
		let _startStageStep = new startStage();
		//let _loadDataStep = new loadData();
		let _messageStep = new messageWindow();
		let _backgroundStep = new background();
		let _layoutStep = new stageLayout();
		let _fadeScreenStep = new fadeScreen();
		let _charaStep = new chara();
		//FlowEventName.GameLoad
		let flowLoad = new Flow(FlowEventName.GameLoad,
			[
				_layoutStep,
				_backgroundStep,
				_mainStageStep,
				_startStageStep,
				_messageStep,
				_charaStep
			]);
		this.flowManger.addFlow(flowLoad);
		//FlowEventName.Test
		let flowTest = new Flow(FlowEventName.Test, []);
		this.flowManger.addFlow(flowTest);
		//FlowEventName.GotoMainStage
		let flowGotoMainStage = new Flow(FlowEventName.GotoMainStage,
			[
				_startStageStep,
				_mainStageStep,
				_backgroundStep
			]);
		this.flowManger.addFlow(flowGotoMainStage);
		//FlowEventName.Action
		let flowAction = new Flow(FlowEventName.Action,
			[
				_mainStageStep,
				_messageStep,
				_fadeScreenStep,
				_backgroundStep,
				_charaStep
			]);
		this.flowManger.addFlow(flowAction);
		//FlowEventName.ActionComplete
		let flowActionComplete = new Flow(FlowEventName.ActionComplete,
			[
				_messageStep,
				_backgroundStep,
				_fadeScreenStep,
				_mainStageStep,
				_charaStep
			]);
		this.flowManger.addFlow(flowActionComplete);
		//...fire all flows
		this.flowManger.fire(FlowEventName.GameLoad);
		this.flowManger.fire(FlowEventName.GotoMainStage);
		this.flowManger.fireLoop(FlowEventName.Action);
		this.flowManger.fireLoop(FlowEventName.ActionComplete);

		this.flowManger.ativeDebug()
	}

}