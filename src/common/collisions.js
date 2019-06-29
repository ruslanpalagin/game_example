const collisions = {
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
        area.position = this.rotatePoint(area.position, unit.position, unit.rotation);
        return area;
    },
    calcUnitHitBox(unit) {

    },
    rotatePoint(point, pivot, angle) {
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
};

export default collisions;
