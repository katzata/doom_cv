import { Container } from "pixi.js";
import { CompleteCallback } from "@pixi/sound";
import { AnimState, Directions } from "./types";
import gsap from "gsap";
import { config, initialState, movement, animations, actions, bindings } from "./cofig";
import Animation from "../Animation";
import Keyboard from "../../core/Keyboard";
import { after } from "../../utils/misc";

/**
 * Example class showcasing the usage of the```Animation``` and ```Keyboard``` classes
 */
export class Player extends Container {
	private keyboardControls;
	anim: Animation;
	currentState: AnimState | null = null;
	deathMarkers: Record<string, number>[] = [];

	animStates: Record<keyof typeof animations, AnimState> = animations;

	config = config;
	movement = movement;
	state = initialState
	reloading = false;

	private decelerationTween?: gsap.core.Tween;

	constructor() {
		super();
		this.keyboardControls = new Keyboard({ actions, bindings });
		this.anim = new Animation("player");

		this.addChild(this.anim);
		this.setAnimState({state: this.animStates.idle});

		this.keyboardControls.onAction(({ action, buttonState }: { action: string, buttonState: "pressed" | "released" }) => {
			if (buttonState === "pressed") this.onActionPress(action);
			else if (buttonState === "released") this.onActionRelease(action);
		});
	};

	/**
	 * Set the animation state.
	 * @param state An object containing animation data.
	 * @param soundCallback A callback to be fired when a sound finishes playing.
	 * @returns the this.anim.play() function.
	 */
	private setAnimState({state, spriteChangeHandler, soundCallback }: {state: AnimState, spriteChangeHandler?: Function, soundCallback?: CompleteCallback}) {
		this.currentState = state;

		const animationData: Record<string, Function | null> = {
			spriteChangeHandler: null,
			soundCallback: null
		};

		if (spriteChangeHandler) animationData.spriteChangeHandler = spriteChangeHandler;
		if (soundCallback) animationData.soundCallback = soundCallback;

		return this.anim.play(spriteChangeHandler || soundCallback ? {...state, ...animationData } : state);
	};

	/**
	 * Update the animation state and pass a callback to be executed after a sound is played.
	 */
	private updateAnimState(): void {
		const { idle, walk, fire, hit, death, reSpawn } = this.animStates;

		if (this.reSpawning) {
			if (this.currentState === reSpawn) return;
			this.setAnimState({ state: reSpawn });
		} else if (this.isDead) {
			if (this.currentState === death) return;

			const setPosY = (frameIndex: number) => {
				this.y = this.deathMarkers[this.deathMarkers.length -1].y + movement.death.y[frameIndex];
			};

			this.setAnimState({ state: death, spriteChangeHandler: setPosY });
		} else if (this.takingHit) {
			if (this.currentState === hit) return;
			this.setAnimState({ state: hit });
		} else if (this.firing) {
			if (this.currentState === fire || this.reloading) return;

			const postFireAction = () => {
				after(
					config.postFireDelay,
					() => {
						this.reloading = false;
						if (this.keyboardControls.isKeyDown("Space")) this.fire();
					}
				);
			};

			this.setAnimState({ state: fire, soundCallback: postFireAction });
		} else if (this.state.velocity.x !== 0) {
			if (this.currentState === walk) return;
			this.setAnimState({ state: walk });
		} else {
			if (this.currentState === idle) return;
			this.setAnimState({ state: idle});
		};
	};

	/**
	 * Handle keyboard button press.
	 * @param action Corresponding to a key binding;
	 */
	private onActionPress(action: keyof typeof this.keyboardControls.actions) {
		switch (action) {
			case "UP":
				this.death();
				break;
			case "DOWN":
				this.takeHit();
				break;
			case "LEFT":
				if (!this.firing && !this.isDead && !this.takingHit) this.move(Directions.LEFT);
				break;
			case "RIGHT":
				if (!this.firing && !this.isDead && !this.takingHit) this.move(Directions.RIGHT);
				break;
			case "FIRE":
				this.fire();
				break;

			default:
				break;
		};
	};

	/**
	 * Handle keyboard button release.
	 * @param action An action corresponding to a release of a pre-defined key;
	 */
	private onActionRelease(action: keyof typeof this.keyboardControls.actions) {
		if (
			(action === "LEFT" && this.state.velocity.x < 0) ||
			(action === "RIGHT" && this.state.velocity.x > 0)
		) {
			this.stopMovement();
		};
	};

	/**
	 * Move the player in a given direction.
	 * @param direction The new x axis coordinates.
	 */
	async move(direction: Directions) {
		this.moving = true;
		this.decelerationTween?.progress(1);
		this.state.velocity.x = direction * this.movement.speed;

		this.updateAnimState();

		gsap.to(this.scale, {
			duration: this.movement.turnDuration,
			x: this.config.scale * direction,
		});
	};

	/**
	 * Stop the player movement.
	 */
	stopMovement() {
		this.decelerationTween?.progress(1);

		this.decelerationTween = gsap.to(this.state.velocity, {
			duration: this.movement.decelerateDuration,
			x: 0,
			ease: "power1.in",
			onComplete: () => {
				this.moving = false;
				this.updateAnimState();
			},
		});
	};

	/**
	 *  Player fire weapon.
	 */
	async fire() {
		if (this.firing || this.reloading) return;

		const { duration, x } = this.movement.fire;

		this.firing = true;
		this.state.velocity.x = 0;
		this.x = this.x - x;

		this.reloading = true;
		await gsap.to(this, { duration });

		this.x = this.x + x;
		this.firing = false;
	};

	/**
	 *  Player take hit.
	 */
	async takeHit() {
		if (this.takingHit || this.isDead) return;

		const direction = this.getDirection();

		this.takingHit = true;
		this.state.velocity.x = 0;
		this.x + (movement.hit.offset / direction);

		await gsap.to(this, {
			duration: (animations.hit.speed * 3),
			x: this.x - (movement.hit.offset / direction)
		});

		this.takingHit = false;
	};

	/**
	 *  Player death.
	 */
	async death() {
		if (this.isDead) return;

		this.isDead = true;
		this.deathMarkers.push({ x: this.x, y: this.y });
	};

	/**
	 *  Player respawn.
	 */
	async reSpawn() {
		if (!this.isDead) return;

		this.reSpawning = true;
		await gsap.to(this, { duration: (animations.reSpawn.speed * 13) });
		this.reSpawning = false;
	};

	/**
	 * Get the firing state.
	 */
	get moving() {
		return this.state.moving;
	};

	/**
	 * Set the moving state.
	 */
	private set moving(value: boolean) {
		this.state.moving = value;
		this.updateAnimState();
	};

	/**
	 * Get the firing state.
	 */
	get firing() {
		return this.state.firing;
	};

	/**
	 * Set the firing state.
	 */
	private set firing(value: boolean) {
		this.state.firing = value;
		this.updateAnimState();
	};

	/**
	 * Get the takingHit state.
	 */
	get takingHit() {
		return this.state.takingHit;
	};

	/**
	 * Set the takingHit state.
	 */
	private set takingHit(value: boolean) {
		this.state.takingHit = value;
		this.updateAnimState();
	};

	/**
	 * Get the isDead state.
	 */
	get isDead() {
		return this.state.isDead;
	};

	/**
	 * Set the isDead state.
	 */
	private set isDead(value: boolean) {
		this.state.isDead = value;
		this.updateAnimState();
	};

	/**
	 * Get the firing state.
	 */
	get reSpawning() {
		return this.state.reSpawning;
	};

	/**
	 * Set the reSpawning state.
	 */
	private set reSpawning(value: boolean) {
		this.state.reSpawning = value;
		this.updateAnimState();
	};

	/**
	 * Get the direction that the player is facing.
	 */
	private getDirection() {
		if (this.state.velocity.x === 0)
			return this.scale.x > 0 ? Directions.RIGHT : Directions.LEFT;

		return this.state.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;
	};
}
