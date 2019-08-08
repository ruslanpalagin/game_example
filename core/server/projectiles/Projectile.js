// const isEqual = require("lodash/isEqual");
// const collisions = require("../../utils/collisions");

class Projectile {
  constructor(sourceEntity, speed, distance, bounds) {
    this.sourceEntity = sourceEntity;
    this.speed = speed;
    this.distance = distance;
    this.bounds = bounds;

    this._remainingDistance = distance;
    this.rotation = sourceEntity.rotation - Math.PI / 2;
    this.position = {
      x: sourceEntity.position.x,
      y: sourceEntity.position.y
    };
    // this.destinationPoint = {
    //   x: sourceEntity.position.x + Math.cos(this.rotation) * distance,
    //   y: sourceEntity.position.y + Math.sin(this.rotation) * distance,
    // };
  }

  get flightDuration() { return this.distance / this.speed; }
  get flightLimitsReached() { return this._remainingDistance < 0; }

  // projection path
  getCollisionArea(newPosition) {
    const { x, y, width, height } = this.bounds;
    return {
      x: this.position.x + x, 
      y: this.position.y + y,
      width,
      height: Math.abs(this.position.y - newPosition.y) + height
    };
  }

  move(newPosition) {
    this.position = newPosition;
  }

  calcNextPosition(delta) {
    let step = this.speed * delta;
    this._remainingDistance -= step;
    if (this._remainingDistance < 0) {
      step += this._remainingDistance;
    }

    const futurePosition = {
      x: this.position.x + Math.cos(this.rotation) * step,
      y: this.position.y + Math.sin(this.rotation) * step
    };
    return futurePosition;
  }
}

module.exports = Projectile;