const catInitialization = async function (t) {
    await t.runForSteps(2);
    let cat = t.getSprites(sprite => sprite.name.includes('katze'))[0];
    t.assert.ok(cat.visible, 'cat must be visible');
    t.end();
};

const treeInitialization = async function (t) {
    await t.runForSteps(2);
    let tree = t.getSprites(sprite => sprite.name.includes('Hindernis'))[0];
    t.assert.ok(!tree.visible, 'tree must not be visible');
    t.end();
};

const catMoving = async function (t) {
    await t.runForSteps(2);
    let cat = t.getSprites(sprite => sprite.name.includes('katze'))[0];
    let catX = cat.x;
    await t.runForSteps(20);
    t.assert.ok(catX < cat.x, "cat must move right");
    catX = cat.x;
    let input = {device: 'keyboard', key: 'Left', isDown: true, duration: 300};
    t.addInput(0, input);
    await t.runForTime(300);
    t.assert.ok(catX > cat.x, "cat must move left");
    catX = cat.x;
    await t.runForSteps(20);
    t.assert.ok(catX < cat.x, "cat must move right again");
    t.end();
};

module.exports = [
    {
        test: catInitialization,
        name: 'initialize cat',
        description: '',
        categories: []
    },
    {
        test: treeInitialization,
        name: 'initialize tree',
        description: '',
        categories: []
    },
    {
        test: catMoving,
        name: 'cat moving',
        description: '',
        categories: []
    }
];