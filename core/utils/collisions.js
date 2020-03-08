const collisions = {
    /**
     * working with view (PIXI) only
     * using rectangle
     */
    findItemByPoint(items, {x, y}) {
        let result = null;
        for(let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (!item.isInteractive) {
                continue;
            }
            const xShift = - item.pivot.x;
            const yShift = - item.pivot.y;
            const left = item.position.x + xShift;
            const top = item.position.y + yShift;
            const right = left + item.width;
            const bottom = top + item.height;

            if (x >= left && x <= right && y >= top && y <= bottom) {
                result = item;
                break;
            }
        }
        return result;
    },
    calcWeaponHitArea(unit) {
        const area = {
            radius: 18,
            position: { x: unit.position.x + 7, y: unit.position.y - 15 },
        };
        area.position = this.rotatePointInversedY(area.position, { pivot: unit.position, angle: unit.rotation });
        return area;
    },
    findUnitsHittingByProjectile(units, collisionArea) {
        return units.filter(unit => this.circleRect(
            unit.position.x,
            unit.position.y,
            18,
            collisionArea.x,
            collisionArea.y,
            collisionArea.width,
            collisionArea.height
        ));
    },
    findUnitsInArea(units, area) {
        return units.filter((unit) => this._isUnitInArea(unit, area));
    },
    _isUnitInArea(unit, area) {
        return this.getDistance(unit, area) <= area.radius;
    },
    rotatePointInversedY(point, { pivot, angle }) {
        return this.rotatePoint(point, { pivot, angle: -angle });
    },
    rotatePoint(point, { pivot, angle }) {
        const s = Math.sin(-angle);
        const c = Math.cos(-angle);

        // translate point back to origin:
        point.x -= pivot.x;
        point.y -= pivot.y;

        // rotate point
        const xnew = point.x * c - point.y * s;
        const ynew = point.x * s + point.y * c;

        // translate point back:
        point.x = xnew + pivot.x;
        point.y = ynew + pivot.y;

        return point;
    },
    movementPointBetween(unit, destination, {speed, delta}) {
        if (!speed) {
            throw new Error("speed is invalid: " + JSON.stringify(speed));
        }
        if (!delta) {
            throw new Error("delta is invalid: " + JSON.stringify(delta));
        }
        const from = unit.position;
        const to = destination.position;
        const angle = this.calcAngleBetween(from, to);

        const distanceBySpeed = (speed / 1000) * delta;
        const maxDistance = this.getDistance(unit, destination);

        if (distanceBySpeed > maxDistance) {
            return {
                position: to,
                rotation: this.calcAngleBetweenInversedY(from, to),
            };
        }

        const tmpDestination = { x: from.x, y: from.y + distanceBySpeed };
        const rotatedPoint = this.rotatePoint(tmpDestination, { pivot: from, angle });
        return {
            position: rotatedPoint,
            rotation: this.calcAngleBetweenInversedY(from, to),
        };
    },
    /**
     * Checks the collision of a circle and a rectangle.
     * @returns Figures intersect?
     * @param {Number} cx 
     * @param {Number} cy 
     * @param {Number} radius 
     * @param {Number} rx 
     * @param {Number} ry 
     * @param {Number} rw 
     * @param {Number} rh 
     */
    circleRect(cx, cy, radius, rx, ry, rw, rh) {
        // temporary variables to set edges for testing
        let testX = cx;
        let testY = cy;

        // which edge is closest?
        if (cx < rx)           testX = rx;      // test left edge
        else if (cx > rx + rw) testX = rx + rw;   // right edge
        if (cy < ry)           testY = ry;      // top edge
        else if (cy > ry + rh) testY = ry + rh;   // bottom edge

        // get distance from closest edges
        const distX = cx - testX;
        const distY = cy - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        // if the distance is less than the radius, collision!
        return distance <= radius;
    },
    getDistance(controlledUnit, clickedItem) {
        const xDiff = Math.abs(controlledUnit.position.x - clickedItem.position.x);
        const yDiff = Math.abs(controlledUnit.position.y - clickedItem.position.y);
        return Math.sqrt( xDiff * xDiff + yDiff * yDiff );
    },
    calcAngleBetween(from, to) {
        return Math.atan2(to.x - from.x, to.y - from.y);
    },
    calcAngleBetweenInversedY(from, to) {
        return Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
    },
};

module.exports = collisions;
