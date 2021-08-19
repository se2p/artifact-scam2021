const headInitialization = async function (t) {
    await t.runForSteps(5);
    let snake = t.getSprites(sprite => sprite.name.includes('Kopf'))[0];
    t.assert.ok(snake.visible, 'head must be visible');
    t.assert.ok(snake.direction === 90, 'head must face right');
    t.end();
};

const bodyInitialization = async function (t) {
    await t.runForSteps(5);
    let body = t.getSprites(sprite => sprite.name.includes('rper'))[0];
    t.assert.ok(body.visible, 'body must be visible');
    t.end();
};

const deleteClones = async function (t) {
    await t.runForSteps(5);
    let snake = t.getSprites(sprite => sprite.name.includes('Kopf'))[0];
    let body = t.getSprites(sprite => sprite.name.includes('rper'))[0];
    let cloneNotDeleted = false;
    let cloneCreated = false;
    t.addCallback(() => {
        if (!cloneCreated && body.getClones().length === 1) {
            cloneCreated = true;
        }
        if (!cloneNotDeleted && body.getClones().length > 1) {
            cloneNotDeleted = true;
        }
    }, true);
    await t.runUntil(() => !t.isProjectRunning(), 5000);
    t.assert.ok(cloneCreated, 'must create clones');
    t.assert.ok(!cloneNotDeleted, 'must delete clones immediately');
    t.end();
};


module.exports = [
    {
        test: headInitialization,
        name: 'initialize head',
        description: '',
        categories: []
    },
    {
        test: bodyInitialization,
        name: 'initialize body',
        description: '',
        categories: []
    },
    {
        test: deleteClones,
        name: 'clones must be deleted',
        description: '',
        categories: []
    }
];