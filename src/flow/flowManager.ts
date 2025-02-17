import { startStage } from "../startStage";
import { mainStage } from "../mainStage";
import { BaseStep, Flow } from "./step";

export enum FlowEventName {
	Test,
	GameLoad,
	GotoMainStage
}
export class FlowManager {
	public constructor() { }
	private static eventName: FlowEventName;
	public flows: Flow[];
	public currentFlow: Flow[];
	public loop: { [id: string]: boolean; } = {};
	public fire(eventName: FlowEventName, sender: object = undefined) {
		//console.log('fire ', eventName);
		this.loop[eventName.toString()] = false
		for (let i = 0; i < this.flows.length; i++) {
			if (this.flows[i].eventName == eventName) {
				if (this.currentFlow.includes(this.flows[i])) {
					console.error('Push flow but already exist! ', this.flows[i]);
				} else {
					this.flows[i].stepIndex = 0;
					this.currentFlow.push(this.flows[i]);
				}
				break;
			}
		}
	}
	public fireLoop(eventName: FlowEventName, sender: object = undefined) {
		this.fire(eventName, sender)
		this.loop[eventName.toString()] = true
	}
	public onUpdate() {
		//console.log('L ', this.currentFlow.length);
		for (let i = 0; i < this.currentFlow.length; i++) {
			let tmp = 0;
			while (true) {
				tmp++;
				if (tmp == 100) {
					console.error('??');
					break;
				}
				if (this.currentFlow[i].steps.length == 0) {
					this.currentFlow.splice(i, 1);
					break;
				}
				BaseStep.runIndex = this.currentFlow[i].stepIndex;
				this.currentFlow[i].steps[this.currentFlow[i].stepIndex].onStep(this.currentFlow[i].eventName);
				if (BaseStep.runIndex == 0) {
					FlowManager.eventName = this.currentFlow[i].eventName;
				}
				if (BaseStep.runIndex == BaseStep.runNextNextFrame) {
					BaseStep.runIndex++;
				}
				if (BaseStep.runIndex == BaseStep.runThisNextFrame) {
					break;
				}
				if (BaseStep.runIndex == this.currentFlow[i].steps.length) {
					if (this.loop[FlowManager.eventName]) {
						BaseStep.runIndex = 0;
					} else {
						this.currentFlow.splice(i, 1);
						break;
					}
				}
				this.currentFlow[i].stepIndex = BaseStep.runIndex;
			}
		}
	}
	public setupFlow() {
		this.flows = [];
		this.currentFlow = [];
		let uiMainStageStep = new mainStage();
		let uiMainMenuStep = new startStage();
		//FlowEventName.GameLoad
		let flowLoad = new Flow(FlowEventName.GameLoad);
		flowLoad.steps.push(uiMainStageStep)
		flowLoad.steps.push(uiMainMenuStep)
		this.flows.push(flowLoad);
		//FlowEventName.Test
		let flowTest = new Flow(FlowEventName.Test);
		this.flows.push(flowTest);
		//FlowEventName.GotoMainStage
		let flowGotoMainStage = new Flow(FlowEventName.GotoMainStage);
		flowGotoMainStage.steps.push(uiMainMenuStep);
		flowGotoMainStage.steps.push(uiMainStageStep);
		this.flows.push(flowGotoMainStage);

	}

}