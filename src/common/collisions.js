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
};

export default collisions;
