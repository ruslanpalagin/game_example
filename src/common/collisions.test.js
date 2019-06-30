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
        it("around 0 0 + 90deg", () => {
            const point = collisions.rotatePoint({x: 0, y: 2}, { pivot: {x: 0, y: 0}, angle: Math.PI / 2 });
            // console.log("around 0 0 ", point);
            expectToBeCloseTo(point.x, 2);
            expectToBeCloseTo(point.y, 0);
        });
        it("around 0 0 + 45deg", () => {
            const point = collisions.rotatePoint({x: 0, y: 1}, { pivot: {x: 0, y: 0}, angle: Math.PI / 4 });
            // console.log("around 0 0 ", point);
            expectToBeCloseTo(point.x, 0.7);
            expectToBeCloseTo(point.y, 0.7);
        });
        it("around 0 0 - 90deg", () => {
            const point = collisions.rotatePoint({x: 0, y: 2}, { pivot: {x: 0, y: 0}, angle: -Math.PI / 2 });
            // console.log("around 0 0 ", point);
            expectToBeCloseTo(point.x, -2);
            expectToBeCloseTo(point.y, 0);
        });
        it("around 5 10", () => {
            const point = collisions.rotatePoint({x: 5, y: 12}, { pivot: {x: 5, y: 10}, angle: Math.PI / 2 });
            // console.log("around 5 10", point);
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
            expectToBeCloseTo(point.position.x, 0.7);
            expectToBeCloseTo(point.position.y, 0.7);
            expectToBeCloseTo(point.rotation, 0.78);
        });
        it("with different speed", () => {
            const point = collisions.movementPointBetween(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 2, y: 2}, rotation: 0},
                { speed: 10, delta: 50 },
            );
            expectToBeCloseTo(point.position.x, 0.35);
            expectToBeCloseTo(point.position.y, 0.35);
            expectToBeCloseTo(point.rotation, 0.78);
        });
        it("to negative sector", () => {
            const point = collisions.movementPointBetween(
                { position: {x: 2, y: 2}, rotation: 0},
                { position: {x: -2, y: -2}, rotation: 0},
                { speed: 1, delta: 1000 },
            );
            expectToBeCloseTo(point.position.x, 1.292);
            expectToBeCloseTo(point.position.y, 1.292);
            expectToBeCloseTo(point.rotation, -2.356);
        });
        it("faster then target", () => {
            const point = collisions.movementPointBetween(
                { position: {x: 0, y: 0}, rotation: 0},
                { position: {x: 4, y: 4}, rotation: 0},
                { speed: 1000, delta: 1000 },
            );
            expectToBeCloseTo(point.position.x, 4);
            expectToBeCloseTo(point.position.y, 4);
            expectToBeCloseTo(point.rotation, 0.78);
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