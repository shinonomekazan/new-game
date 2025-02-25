import { FlowEventName } from "../mainScene";

export class BaseStep {
	public onLoad() { }
	public onUpdate() { }
	public onStep(eventName: FlowEventName) {
		console.log('onstep');
	}
	public static runIndex: number;
	public static readonly runThisNextFrame: number = -1;
	public static readonly runNextNextFrame: number = -2;
	public runThisNextFrame() {
		BaseStep.runIndex = BaseStep.runThisNextFrame;
	}
	public runNext() {
		BaseStep.runIndex++;
	}
}
export class Flow {
	constructor(eventName: FlowEventName) {
		this.eventName = eventName
	}
	public stepIndex: number = 0;
	public eventName: FlowEventName;
	public steps: BaseStep[] = [];
}