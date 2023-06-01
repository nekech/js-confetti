import { INormalizedAddConfettiConfig, IPosition, IRadius, ISpeed, TConfettiDirection } from './types'
import { generateRandomNumber } from './generateRandomNumber'
import { generateRandomArrayElement } from './generateRandomArrayElement'
import {
    FREE_FALLING_OBJECT_ACCELERATION,
    MIN_DRAG_FORCE_COEFFICIENT,
    MAX_DRAG_FORCE_COEFFICIENT,
    ROTATION_SLOWDOWN_ACCELERATION,
  
    MIN_INITIAL_CONFETTI_SPEED,
    MAX_INITIAL_CONFETTI_SPEED,
  
    MIN_FINAL_X_CONFETTI_SPEED,
    MAX_FINAL_X_CONFETTI_SPEED,
  
    MIN_INITIAL_ROTATION_SPEED,
    MAX_INITIAL_ROTATION_SPEED,
  
    MIN_CONFETTI_ANGLE,
    MAX_CONFETTI_ANGLE,
  
    MAX_CONFETTI_POSITION_SHIFT,
  
    SHAPE_VISIBILITY_TRESHOLD,
  } from './consts'

  interface ShapeArgs extends INormalizedAddConfettiConfig {
    canvasWidth: number
  }

abstract class Shape{
    protected confettiSpeed: ISpeed
    protected rotationSpeed: number

    protected radius: IRadius
    protected readonly initialRadius: number
    protected readonly rotationAngle: number
    protected emojiSize: number
    protected emojiRotationAngle: number
  
    protected initialPosition: IPosition
    protected currentPosition: IPosition

    protected readonly color: string | null
    protected readonly emoji: string | null

    constructor(args: ShapeArgs) {
        const {
          confettiRadius,
          confettiColors,
          emojis,
          emojiSize,
          canvasWidth,
        } = args
        
        this.confettiSpeed = {
          x: 0,
          y: 0,
        }

        this.rotationSpeed = emojis.length ? 0.01 : generateRandomNumber(MIN_INITIAL_ROTATION_SPEED, MAX_INITIAL_ROTATION_SPEED, 3) * Shape.getWindowWidthCoefficient(canvasWidth)

        this.radius = {
            x: confettiRadius, y: confettiRadius
        }

        this.initialRadius = confettiRadius
        this.rotationAngle = 0
        this.emojiSize = emojiSize
        this.emojiRotationAngle = generateRandomNumber(0, 2 * Math.PI)

        this.color = emojis.length ? null : generateRandomArrayElement(confettiColors)
        this.emoji = emojis.length ? generateRandomArrayElement(emojis) : null

        this.initialPosition = {x : 0, y: 0}
        this.currentPosition = {x : 0, y: 0}

    }

    abstract draw(canvasContext: CanvasRenderingContext2D): void;

    abstract updatePosition(iterationTimeDelta: number, currentTime: number): void;


    getIsVisibleOnCanvas(canvasHeight: number): boolean {
        return this.currentPosition.y < canvasHeight + SHAPE_VISIBILITY_TRESHOLD
    }
    // For wide screens - fast confetti, for small screens - slow confetti
   public static getWindowWidthCoefficient(canvasWidth: number) {
    const HD_SCREEN_WIDTH = 1920
  
    return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH)
  }

}

export { ShapeArgs, Shape }