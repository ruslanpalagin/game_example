const isEqual = require("lodash/isEqual");
const collisions = require("../../utils/collisions");

class Projectile {
  constructor(sourceEntity, speed, distance) {
    this.sourceEntity = sourceEntity;
    this.speed = speed;
    this.distance = distance;
    this.position = {
      x: sourceEntity.position.x,
      y: sourceEntity.position.y
    };
    this.destinationPoint = {
      x: sourceEntity.position.x + Math.cos(sourceEntity.rotation - Math.PI / 2) * distance,
      y: sourceEntity.position.y + Math.sin(sourceEntity.rotation - Math.PI / 2) * distance,
    };
  }

  move(delta) {
    const step = this.speed * delta;
  }
}

module.exports = Projectile;