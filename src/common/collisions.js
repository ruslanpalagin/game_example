const collisions = {
    // TODO rework to area
    findItemByPoint(items, {x, y}) {
        let result = null;
        for(let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            // console.log("item", item);
            if (!item.isInteractive) {
                continue;
            }
            const xShift = - item.width * 0.5;
            const yShift = - item.height * 0.5;
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
    findItemInRect(items, {left, top, right, bottom}) {

    },
    calcWeaponHitBox(unit) {
        const area = {
            radius: 14,
            position: { x: unit.position.x + 7, y: unit.position.y - 15 },
        };
        area.position = this.rotatePoint(area.position, { pivot: unit.position, angle: unit.rotation });
        return area;
    },
    calcUnitHitBox(unit) {

    },
    rotatePoint(point, { pivot, angle }) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

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
        const from = unit.position;
        const to = destination.position;
        const angle = this.calcAngleBetween(from, to);
        const distance = (speed / 1000) * delta;
        console.log("distance", distance);
        const toPartial = { x: from.x, y: from.y + distance };
        console.log("toPartial", toPartial);
        return {
            position: this.rotatePoint(from, { pivot: toPartial, angle }),
            rotation: angle,
        };
    },
    getDistance(controlledUnit, clickedItem) {
        const xDiff = Math.abs(controlledUnit.position.x - clickedItem.position.x);
        const yDiff = Math.abs(controlledUnit.position.y - clickedItem.position.y);
        return Math.sqrt( xDiff * xDiff + yDiff * yDiff );
    },
    _calcAngle(x, y) {
        return Math.atan2(y, x);
    },
    calcAngleBetween(from, to) {
        return Math.atan2(to.x - from.x, to.y - from.y);
    },
};

export default collisions;
