import { BaseStep } from "./flow/step";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
export class actionSender {
	action: string;
	values: { id: string, value: string }[]
	setValue(values: { id: string, value: string }[]) {

	}
	getValue(name: string): string {
		for (var i = 0; i < this.values.length; i++) {
			if (this.values[i].id == name) {
				return this.values[i].value;
			}
		}
		return undefined;
	}
}
export class mainStage extends BaseStep {
	private sheetScript: string[][];
	private index = 0;
	private waitComplete = false;
	private waitLoadSheet = false;
	private finish = false;
	private gotoMainState = false;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.loadGoogleSheet()
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				this.gotoMainState = true;
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					if (this.waitLoadSheet || this.finish || this.gotoMainState == false) {
						this.runThisNextFrame();
						break;
					}
					if (this.waitComplete) {
						this.runThisNextFrame();
					} else {
						if (this.index < this.sheetScript.length) {
							console.log('RUN');
							this.process()
						} else {
							console.log('FINISH!');
							this.finish = true;
						}
					}
				}
				break;
			case FlowEventName.ActionComplete:
				{
					if (this.finish || this.gotoMainState == false) {
						this.runThisNextFrame()
						break;
					}
					this.waitComplete = false;
					this.runNext();
				}
				break;
		}

	}
	private process() {
		let runNext = false;
		let text = this.sheetScript[this.index]
		while (text.length == 0) {
			this.index++;
			text = this.sheetScript[this.index]
			if (this.index == this.sheetScript.length) {
				break;
			}
		}
		switch (text[0]) {
			case 'typing-effect':
				{
					let sen = new actionSender();
					sen.action = text[0];
					sen.values = [
						{
							id: 'istrue', value: text[1]
						}
					];
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case '':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'message';
					sen.values = [
						{
							id: 'mess', value: text[1]
						}
					];
					console.log('.,,,,', sen.values);
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'fadeinout':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'fadeout';
					const str = text[1];
					const match = str.match(/=(\d+)/);
					sen.values = [
						{
							id: 'time', value: match ? match[1] : '0'
						}
					];
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'next-mess-button':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'next-mess-button';

					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'background':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'background';
					sen.values = [
						{
							id: 'url',
							value: text[1]
						}
					]
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			default:
				break;
		}
		console.log('index ', this.index);
		this.index++;
		if (runNext == false) {
			this.runThisNextFrame()
		}
	}
	private async loadGoogleSheet() {
		this.waitLoadSheet = true;
		const urlParams = new URLSearchParams(window.location.search);
		const SHEET_ID = urlParams.get('sheetid')
		const API_KEY = urlParams.get('ggogleapi')
		if (SHEET_ID == null || API_KEY == null) {
			throw ('api not found')
		}
		const RANGE = "Sheet1!A1:D100";
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			this.sheetScript = data.values;
			this.waitLoadSheet = false;
			console.log(this.sheetScript);
		} catch (error) {
			console.error("Error Google Sheet:", error);
		}
	}
}