import gsap from "gsap";
import { AnimState, Directions } from "./types";
import { config, movement, animations, actions, bindings } from "./cofig";
import { Container } from "pixi.js";
import Animation from "../Animation";
import Keyboard from "../../core/Keyboard";
import { wait } from "../../utils/misc";

/**
 * Example class showcasing the usage of the```Animation``` and ```Keyboard``` classes
 */
export class Player extends Container {
	private keyboardControls;
	anim: Animation;
	currentState: AnimState | null = null;

	static animStates: Record<string, AnimState> = animations;

	config = config;
	movement = movement;

	state = {
		moving: false,
		firing: false,
		dashing: false,
		velocity: {
			x: 0,
			y: 0,
		},
	};

	private decelerationTween?: gsap.core.Tween;

	constructor() {
		super();

		this.keyboardControls = new Keyboard({ actions, bindings });
		this.anim = new Animation("player");

		this.addChild(this.anim);

		this.setState(Player.animStates.idle);

		this.keyboardControls.onAction(({ action, buttonState }) => {
			if (buttonState === "pressed") this.onActionPress(action);
			else if (buttonState === "released") this.onActionRelease(action);
		});
	};

	setState(state: AnimState) {
		this.currentState = state;
		return this.anim.play(state);
	};

	private updateAnimState() {
		const { walk, fire, death, idle } = Player.animStates;
		// console.log(this.firing, this.state);

		if (this.dashing) {
			if (this.currentState === death) return;

			this.setState(death);
		} else if (this.firing) {
			if (this.currentState === fire || this.currentState === death) return;

			this.setState(fire);
		} else if (this.state.velocity.x !== 0) {
			if (this.currentState === walk) return;

			this.setState(walk);
		} else {
			if (this.currentState === idle) return;

			this.setState(idle);
		};
	};

	private onActionPress(action: keyof typeof this.keyboardControls.actions) {
		console.log(this.keyboardControls.isKeyDown("ArrowRight"));

		switch (action) {
			case "LEFT":
				if (!this.firing) this.move(Directions.LEFT);
				break;
			case "RIGHT":
				if (!this.firing) this.move(Directions.RIGHT);
				break;
			case "FIRE":
				this.fire();
				break;
			case "SHIFT":
				this.dash();
				break;

			default:
				break;
		};
	};

	async move(direction: Directions) {
		// if (this.firing) return;

		this.decelerationTween?.progress(1);
		this.state.velocity.x = direction * this.movement.speed;

		this.updateAnimState();

		gsap.to(this.scale, {
			duration: this.movement.turnDuration,
			x: this.config.scale * direction,
		});
	};

	async fire() {
		if (this.firing) return;

		const { duration, x } = this.movement.fire;
		// console.log(this.anim);

		this.firing = true;
		this.x = this.x - x;
		await gsap.to(this, {
			duration,
			onComplete: () => {
				this.x = this.x + x;
				this.firing = false;
				// this.updateAnimState();
			}
		});

	};

	private onActionRelease(action: keyof typeof Keyboard.actions) {
		if (
			(action === "LEFT" && this.state.velocity.x < 0) ||
			(action === "RIGHT" && this.state.velocity.x > 0)
		) {
			this.stopMovement();
		};
	};

	stopMovement() {
		this.decelerationTween?.progress(1);

		this.decelerationTween = gsap.to(this.state.velocity, {
			duration: this.movement.decelerateDuration,
			x: 0,
			ease: "power1.in",
			onComplete: () => {
				this.updateAnimState();
			},
		});
	};

	private getDirection() {
		if (this.state.velocity.x === 0)
			return this.scale.x > 0 ? Directions.RIGHT : Directions.LEFT;

		return this.state.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;
	};

	get firing() {
		return this.state.firing;
	};

	private set firing(value: boolean) {
		this.state.firing = value;
		this.updateAnimState();
	};

	private set dashing(value: boolean) {
		this.state.dashing = value;
		this.updateAnimState();
	}

	get dashing() {
		return this.state.dashing;
	};

	async dash() {
		if (this.state.velocity.x === 0) return;

		this.dashing = true;

		this.decelerationTween?.progress(1);

		this.state.velocity.x =
			this.movement.speed *
			this.movement.dash.speedMultiplier *
			this.getDirection();

		await wait(this.movement.dash.duration);

		this.state.velocity.x = this.movement.speed * this.getDirection();

		this.dashing = false;
	};
}
