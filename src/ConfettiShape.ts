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

import {ShapeArgs, Shape} from './Shape'


// For wide screens - fast confetti, for small screens - slow confetti
function getWindowWidthCoefficient(canvasWidth: number) {
  const HD_SCREEN_WIDTH = 1920

  return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH)
}

interface TConstructorArgs extends ShapeArgs {
  initialPosition: IPosition,
  direction: TConfettiDirection
}

class ConfettiShape extends Shape {
  private dragForceCoefficient: number
  private finalConfettiSpeedX: number

  // We can calculate absolute cos and sin at shape init
  private readonly absCos: number
  private readonly absSin: number

  private radiusYUpdateDirection: 'up' | 'down'

  private readonly createdAt: number

  private readonly direction: TConfettiDirection

  constructor(args: TConstructorArgs) {
    const {
      initialPosition,
      direction,
      confettiRadius,
      confettiColors,
      emojis,
      emojiSize,
      canvasWidth,
    } = args

    super(args)
  
    const randomConfettiSpeed = generateRandomNumber(MIN_INITIAL_CONFETTI_SPEED, MAX_INITIAL_CONFETTI_SPEED, 3)
    const initialSpeed = randomConfettiSpeed * getWindowWidthCoefficient(canvasWidth)

    this.confettiSpeed = {
      x: initialSpeed,
      y: initialSpeed,
    }

    this.finalConfettiSpeedX = generateRandomNumber(MIN_FINAL_X_CONFETTI_SPEED, MAX_FINAL_X_CONFETTI_SPEED, 3)

    this.dragForceCoefficient = generateRandomNumber(MIN_DRAG_FORCE_COEFFICIENT, MAX_DRAG_FORCE_COEFFICIENT, 6)

    this.radiusYUpdateDirection = 'down'

    const angle = direction === 'left'
      ? generateRandomNumber(MAX_CONFETTI_ANGLE, MIN_CONFETTI_ANGLE) * Math.PI / 180
      : generateRandomNumber(-MIN_CONFETTI_ANGLE, -MAX_CONFETTI_ANGLE) * Math.PI / 180

    this.absCos = Math.abs(Math.cos(angle))
    this.absSin = Math.abs(Math.sin(angle))

    const positionShift = generateRandomNumber(-MAX_CONFETTI_POSITION_SHIFT, 0)

    const shiftedInitialPosition = {
      x: initialPosition.x + (direction === 'left' ? -positionShift : positionShift) * this.absCos,
      y: initialPosition.y - positionShift * this.absSin,
    }

    this.currentPosition = { ...shiftedInitialPosition }
    this.initialPosition = { ...shiftedInitialPosition }

    this.createdAt = new Date().getTime()
    this.direction = direction
  }

  draw(canvasContext: CanvasRenderingContext2D): void {
    const {
      currentPosition,
      radius,
      color,
      emoji,
      rotationAngle,
      emojiRotationAngle,
      emojiSize,
    } = this
    const dpr = window.devicePixelRatio

    if (color) {
      canvasContext.fillStyle = color

      canvasContext.beginPath()

      canvasContext.ellipse(
        currentPosition.x * dpr, currentPosition.y * dpr, radius.x * dpr, radius.y * dpr,
        rotationAngle, 0, 2 * Math.PI,
      )
      canvasContext.fill()
    } else if (emoji) {
      canvasContext.font = `${emojiSize}px serif`

      canvasContext.save()
      canvasContext.translate(dpr * currentPosition.x, dpr * currentPosition.y)
      canvasContext.rotate(emojiRotationAngle)
      canvasContext.textAlign = 'center'
      canvasContext.fillText(emoji, 0, 0)
      canvasContext.restore()
    }
  }

  updatePosition(iterationTimeDelta: number, currentTime: number): void {
    const {
      confettiSpeed,
      dragForceCoefficient,
      finalConfettiSpeedX,
      radiusYUpdateDirection,
      rotationSpeed,
      createdAt,
      direction,
    } = this

    const timeDeltaSinceCreation = currentTime - createdAt

    if (confettiSpeed.x > finalConfettiSpeedX) this.confettiSpeed.x -= dragForceCoefficient * iterationTimeDelta

    this.currentPosition.x += confettiSpeed.x * (direction === 'left' ? -this.absCos : this.absCos) * iterationTimeDelta

    this.currentPosition.y = (
      this.initialPosition.y
      - confettiSpeed.y * this.absSin * timeDeltaSinceCreation
      + FREE_FALLING_OBJECT_ACCELERATION * (timeDeltaSinceCreation ** 2) / 2
    )

    this.rotationSpeed -= this.emoji ? 0.0001 : ROTATION_SLOWDOWN_ACCELERATION * iterationTimeDelta

    if (this.rotationSpeed < 0) this.rotationSpeed = 0

    // no need to update rotation radius for emoji
    if (this.emoji) {
      this.emojiRotationAngle += (this.rotationSpeed * iterationTimeDelta) % (2 * Math.PI)

      return
    }

    if (radiusYUpdateDirection === 'down') {
      this.radius.y -= iterationTimeDelta * rotationSpeed

      if (this.radius.y <= 0) {
        this.radius.y = 0
        this.radiusYUpdateDirection = 'up'
      }
    } else {
      this.radius.y += iterationTimeDelta * rotationSpeed

      if (this.radius.y >= this.initialRadius) {
        this.radius.y = this.initialRadius
        this.radiusYUpdateDirection = 'down'
      }
    }
  }
}

export { ConfettiShape }
