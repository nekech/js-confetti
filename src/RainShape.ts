import { INormalizedAddConfettiConfig, IPosition, IRadius, ISpeed, TConfettiDirection } from './types'
import { generateRandomNumber } from './generateRandomNumber'
import { generateRandomArrayElement } from './generateRandomArrayElement'

import {ShapeArgs, Shape} from './Shape'
import { ROTATION_SLOWDOWN_ACCELERATION } from './consts'

interface RainArgs extends ShapeArgs {
  velocityY : number;
}

class RainShape extends Shape
{
    private frequencyX: number;
    private amplitudeX: number;
    private velocityY: number ;

    constructor(args: RainArgs) {
        super(args)

        this.initialPosition.y =  generateRandomNumber(-10, 0)
        this.initialPosition.x = generateRandomNumber(0, args.canvasWidth)
        this.currentPosition = { ...this.initialPosition }
        this.rotationSpeed = 0.0005
        this.frequencyX = Math.random() * 0.03 + 0.02;
        this.amplitudeX = Math.random()+ 0.1;
        this.velocityY = args.velocityY;
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
          }
          else if (emoji) {
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
            rotationSpeed,
            createdAt,
          } = this

          const timeDeltaSinceCreation = currentTime - createdAt

          this.currentPosition.y += this.velocityY + 0.4 * Math.random()

          this.currentPosition.x += Math.cos(this.currentPosition.y * this.frequencyX) * this.amplitudeX

          if (this.currentPosition.y > this.canvasHeight) {
            this.currentPosition.y = generateRandomNumber(-10, 0)
            this.currentPosition.x = generateRandomNumber(0, this.canvasWidth)
          }

        // no need to update rotation radius for emoji
        if (this.emoji) {
        this.emojiRotationAngle += (this.rotationSpeed * iterationTimeDelta) % (2 * Math.PI)

        return
        }
    }
}

export { RainShape }