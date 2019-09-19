module.exports = {
  SHOT: {
    id: 'SHOT',
    distance: 150,
    speed: 0.18, // per ms
    bounds: { x: -2.5, y: -7.5, width: 5, height: 15 }
  },
  GRENADE: {
    id: 'GRENADE',
    distance: 270,
    speed: 0.2, // per ms
    bounds: { x: -2.5, y: -7.5, width: 5, height: 15 } // calculated by PIXI
  }
};