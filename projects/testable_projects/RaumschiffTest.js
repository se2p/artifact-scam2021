const rocketInitialization = async function (t) {
    await t.runForSteps(2);
    let rocket = t.getSprites(sprite => sprite.name.includes('Raumschiff'))[0];
    t.assert.ok(rocket.visible, 'rocket must be visible');
    t.end();
};

const blackHoleInitialization = async function (t) {
    await t.runForSteps(2);
    let hole = t.getSprites(sprite => sprite.name.includes('Schwarz'))[0];
    t.assert.ok(hole.visible, 'black hole must be visible');
    t.end();
};

const starInitialization = async function (t) {
    await t.runForSteps(2);
    let star = t.getSprites(sprite => sprite.name.includes('Stern'))[0];
    t.assert.ok(!star.visible, 'star must not be visible');
    t.end();
};

const moonInitialization = async function (t) {
    await t.runForSteps(2);
    let moon = t.getSprites(sprite => sprite.name.includes('Mond'))[0];
    t.assert.ok(moon.visible, 'moon must not be visible');
    t.end();
};

const rocketMoving = async function (t) {
    await t.runForSteps(2);
    let rocket = t.getSprites(sprite => sprite.name.includes('Raumschiff'))[0];
    let rocketY = rocket.y;
    await t.runForSteps(20);
    t.assert.ok(rocketY < rocket.y, "rocket must move");
    let rocketDir = rocket.direction;
    let input = {device: 'keyboard', key: 'Right', isDown: true, duration: 100};
    t.addInput(0, input);
    await t.runForTime(100);
    t.assert.ok(rocketDir < rocket.direction, "rocket must turn right");
    rocketDir = rocket.direction;
    await t.runForSteps(20);
    t.assert.ok(rocketDir === rocket.direction, "rocket must not turn right");
    t.end();
};

module.exports = [
    {
        test: rocketInitialization,
        name: 'initialize rocket',
        description: '',
        categories: []
    },
    {
        test: blackHoleInitialization,
        name: 'initialize black hole',
        description: '',
        categories: []
    },
    {
        test: starInitialization,
        name: 'initialize star',
        description: '',
        categories: []
    },
    {
        test: moonInitialization,
        name: 'initialize moon',
        description: '',
        categories: []
    },
    {
        test: rocketMoving,
        name: 'rocket moving',
        description: '',
        categories: []
    }
];