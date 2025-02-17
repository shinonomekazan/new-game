export class Button extends g.FrameSprite {
	readonly onClick: g.Trigger = new g.Trigger();
	constructor(scene: g.Scene, src: g.ImageAsset | g.Surface, width: number, height: number) {
		super({
			scene: scene,
			src: src,
			height: width,
			width: height,
			frameNumber: 0,
			frames: [0, 1, 2],//normal, click, disable
			touchable: true,
		})
		this.onPointUp.add(() => {
			this.onClick.fire();
		});
	}
}