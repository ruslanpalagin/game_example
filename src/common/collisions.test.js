import collisions from "./collisions.js";

const expectToBeCloseTo = (current, expected) => {
    expect(current).toBeGreaterThanOrEqual(expected - 0.01);
    expect(current).toBeLessThanOrEqual(expected + 0.01);
};

describe("collisions", () => {

    describe("calcAngleBetween", () => {
        it("with low lvl method", () => {
            const angle = collisions._calcAngle(1, 1);
            expectToBeCloseTo(angle, 0.785);
        });
        it("with 45 deg", () => {
            const angle = collisions.calcAngleBetween({ x: 1, y: 0 }, { x: 3, y: 2 });
            // console.log("angle", angle);
            expectToBeCloseTo(angle, 0.785);
        });
        it("with 90 + 45 deg", () => {
            const angle = collisions.calcAngleBetween({ x: 1, y: 0 }, { x: 3, y: -2 });
            expectToBeCloseTo(angle, 2.356);
            // console.log("angle", angle);
        });
        it("with 180 + 45 deg", () => {
            const angle = collisions.calcAngleBetween({ x: 0, y: 5 }, { x: -5, y: 0 });
            expectToBeCloseTo(angle, -2.356);
            // console.log("angle", angle);
        });
        it("with 180 + 45 deg", () => {
            const angle = collisions.calcAngleBetween({ x: 0, y: 5 }, { x: -5, y: 10 });
            expectToBeCloseTo(angle, -0.785);
            // console.log("angle", angle);
        });
    });

    describe("rotatePoint", () => {
        it("around 0 0", () => {
            const point = collisions.rotatePoint({x: 10, y: 11}, { pivot: {x: 10, y: 10}, angle: Math.PI / 2 });
            console.log("around 0 0 ", point);
            expectToBeCloseTo(point.x, 1);
            expectToBeCloseTo(point.y, 0);
        });
        it("around 5 10", () => {
            const point = collisions.rotatePoint({x: 5, y: 12}, { pivot: {x: 5, y: 10}, angle: Math.PI / 2 });
            console.log("around 5 10", point);
            expectToBeCloseTo(point.x, 7);
            expectToBeCloseTo(point.y, 10);
        });
    });

    describe("movementPointBetween", () => {
        it("simple example", () => {
            const point = collisions.movementPointBetween(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 2, y: 2}, rotation: 0},
                { speed: 1, delta: 1000 },
            );
            console.log("point", point);
            // expect(point.position.x).toBe(1);
            // expect(point.position.y).toBe(1);
        });
    });

    describe("getDistance", () => {
        it("diagonal", () => {
            const distance = collisions.getDistance(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 3, y: 4}, rotation: 0},
            );
            expect(distance).toBe(5);
        });
        it("by x", () => {
            const distance = collisions.getDistance(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 3, y: 0}, rotation: 0},
            );
            expect(distance).toBe(3);
        });
        it("by y", () => {
            const distance = collisions.getDistance(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 0, y: 4}, rotation: 0},
            );
            expect(distance).toBe(4);
        });
    });

});