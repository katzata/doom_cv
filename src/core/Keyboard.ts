import { utils } from "pixi.js";

export default class Keyboard extends utils.EventEmitter {
	states = {
		ACTION: "ACTION",
	};

	actions: Record<string, string> = {};
	actionKeyMap: Record<string, string> = {};
	allKeys: string[] = [];
	keyActionMap: Record<string, string> = {};

	private keyMap = new Map<string, boolean>();

	constructor({ actions, bindings }: Record<string, Record<string, string>>) {
		super();

		this.actions = actions;
		this.actionKeyMap = bindings;
		this.allKeys = Object.values(bindings);

		this.keyActionMap = Object.entries(bindings).reduce(
			(acc, [key, action]) => {
				acc[action] = key as keyof typeof this.actions;

				return acc;
			},
			{} as Record<string, keyof typeof bindings>
		);

		this.listenToKeyEvents();
	};

	private listenToKeyEvents() {
		document.addEventListener("keydown", (e) => this.onKeyPress(e.code));
		document.addEventListener("keyup", (e) => this.onKeyRelease(e.code));
		window.addEventListener("blur", () => this.onWindowBlur());
	};

	private onKeyPress(key: string): void {
		const currentKey = this.keyCheck(key);
		if (this.isKeyDown(key) || !currentKey) return;

		this.keyMap.set(currentKey, true);

		this.emit(this.states.ACTION, {
			action: this.keyActionMap[currentKey],
			buttonState: "pressed",
		});
	};

	private onKeyRelease(key: string): void {
		const currentKey = this.keyCheck(key);
		if (!currentKey) return;

		this.keyMap.set(currentKey, false);

		this.emit(this.states.ACTION, {
			action: this.keyActionMap[currentKey],
			buttonState: "released",
		});
	};

	private onWindowBlur() {
		for (const key of this.keyMap.keys()) {
			this.onKeyRelease(key);
		};
	};

	private keyCheck(key: string): string | undefined {
		let keyRes: string | undefined;

		for (const keyX in this.keyActionMap) {
			if (keyX.indexOf(key) > -1) {
				keyRes = keyX;
				break;
			};
		};

		return keyRes;
	};

	// public static getInstance(): Keyboard {
	// 	if (!this.keyboardInstance) {
	// 		this.keyboardInstance = new Keyboard();
	// 	};

	// 	return this.keyboardInstance;
	// };

	public isKeyDown(key: string): boolean {
		// console.log(key, this.keyMap.get(key));
		return this.keyMap.get(key) ?? false;
	};

	public onAction(
		callback: (e: {
			action: string;
			buttonState: "pressed" | "released";
		}) => void
	): void {
		this.on(this.states.ACTION, callback);
	};

	// public getAction(action: keyof typeof this.actions): boolean {
	// 	return this.isKeyDown(this.actionKeyMap[action]);
	// };
};
