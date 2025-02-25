import { startStage } from "../startStage";
import { mainStage } from "../mainStage";
import { BaseStep, Flow } from "./step";
import { FlowEventName } from "../mainScene";
export class FlowManager {
	public constructor() { }
	public static eventName: FlowEventName;
	public flows: Flow[] = [];
	public currentFlow: Flow[] = [];
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
			for (var j = 0; j < this.currentFlow[i].steps.length; j++) {
				this.currentFlow[i].steps[j].onUpdate();
			}
		}
		for (let i = 0; i < this.currentFlow.length; i++) {
			FlowManager.eventName = this.currentFlow[i].eventName;
			let tmp = 0;
			while (true) {
				tmp++;
				if (tmp == 100) {
					console.error('??', FlowManager.eventName);
					throw (this.currentFlow[i].steps[this.currentFlow[i].stepIndex])
					break;
				}
				if (this.currentFlow[i].steps.length == 0) {
					this.currentFlow.splice(i, 1);
					break;
				}
				BaseStep.runIndex = this.currentFlow[i].stepIndex;
				this.currentFlow[i].steps[this.currentFlow[i].stepIndex].onStep(this.currentFlow[i].eventName);
				if (BaseStep.runIndex == BaseStep.runNextNextFrame) {
					BaseStep.runIndex++;
				}
				if (BaseStep.runIndex == BaseStep.runThisNextFrame) {
					break;
				}
				if (BaseStep.runIndex == this.currentFlow[i].steps.length) {
					if (this.loop[this.currentFlow[i].eventName]) {
						BaseStep.runIndex = 0;
						this.currentFlow[i].stepIndex = 0;
					} else {
						this.currentFlow.splice(i, 1);
					}
					break;
				}
				this.currentFlow[i].stepIndex = BaseStep.runIndex;
			}
		}
	}
	public addFlow(flow: Flow) {
		this.flows.push(flow);
	}
}