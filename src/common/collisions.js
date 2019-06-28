const collisions = {
    findItemByPoint(items, {x, y}) {
        let result = null;
        for(let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (!item.isInteractive) {
                continue;
            }
            const xShift = - item.width * item.anchor.x;
            const yShift = - item.height * item.anchor.y;
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
};

export default collisions;
