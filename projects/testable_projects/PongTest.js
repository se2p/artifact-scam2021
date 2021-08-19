const ballInitialization = async function (t) {
    await t.runForSteps(5);
    let ball = t.getSprites(sprite => sprite.name.includes('Ball'))[0];
    t.assert.ok(ball.visible, 'ball must be visible');
    t.end();
};

const paddleInitialization = async function (t) {
    await t.runForSteps(5);
    let paddle = t.getSprites(sprite => sprite.name.includes('Spieler'))[0];
    t.assert.ok(paddle.visible, 'player must be visible');
    t.end();
};

const computerInitialization = async function (t) {
    await t.runForSteps(5);
    let paddle = t.getSprites(sprite => sprite.name.includes('Computer'))[0];
    t.assert.ok(paddle.visible, 'computer must be visible');
    t.end();
};

const outInitialization = async function (t) {
    await t.runForSteps(5);
    let out = t.getSprites(sprite => sprite.name.includes('Aus-Linie Spieler'))[0];
    t.assert.ok(out.visible, 'out player must be visible');
    t.end();
};

const outComputerInitialization = async function (t) {
    await t.runForSteps(5);
    let out = t.getSprites(sprite => sprite.name.includes('Aus-Linie Computer'))[0];
    t.assert.ok(out.visible, 'out computer must be visible');
    t.end();
};

const ballOut = async function (t) {
    await t.runForSteps(5);
    let stage = t.getStage();
    let score = stage.getVariables(variable => variable.name.includes('Meine Punkte'))[0];
    let state = stage.getVariables(variable => variable.name.includes('Status'))[0];
    if (parseInt(score.value, 10) <= 1){
        t.assert.ok(state.value.startsWith('Anf'), "score <= 1 but not Anf");
    }
    if (parseInt(score.value, 10) > 1) {
        t.assert.ok(state.value === 'Experte', "score >1 but not Experte at beginning");
        let reset = t.getSprites(sprite => sprite.name.includes('Reset'))[0];
        let clickInput = {device: 'mouse', x: reset.x, y: reset.y, isDown: true, duration: 200};
        t.addInput(0, clickInput);
        await t.runForTime(500);
        t.assert.ok(score.value === '0', "score must be 0 after reset");
        t.assert.ok(state.value.startsWith('Anf'), "score ==0 but not Anf");
    }

    t.assert.ok(state.value.startsWith('Anf'), "score <=1 but not Anf");
    let ball = t.getSprites(sprite => sprite.name.includes('Ball'))[0];
    let paddle = t.getSprites(sprite => sprite.name.includes('Spieler'))[0];
    let reset = t.getSprites(sprite => sprite.name.includes('Reset'))[0];
    let clickInput = {device: 'mouse', x: reset.x, y: reset.y, isDown: true, duration: 50};
    t.addInput(0, clickInput);
    await t.runForTime(10);

    t.assert.ok(score.value === '0', "score must be 0 after reset");
    t.assert.ok(state.value.startsWith('Anf'), "score ==0 but not Anf");

    t.addCallback(() => {
        if (Math.abs(paddle.y - ball.y) <= 10) {
            if (t.isKeyDown('Up')) {
                t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            }
            if (t.isKeyDown('Down')) {
                t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            }
        } else if (paddle.y > ball.y) {
            t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Down', isDown: true});
        } else if (paddle.y < ball.y) {
            t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Up', isDown: true});
        }

    });

    while (parseInt(score.value, 10) < 2) {
        if (!t.isProjectRunning()) {
            t.greenFlag();
            await t.runForSteps(10);
            t.assert.ok(t.isProjectRunning(), "project must run");
            t.assert.ok(state.value.startsWith('Anf'), "score <= 1 but not Anf");
        }
        await t.runUntil(() => !t.isProjectRunning(), 60000);
        t.assert.ok(!t.isProjectRunning(), "project must not run");
    }

    t.assert.ok(parseInt(score.value, 10) > 1, "score must be bigger than 1");
    t.assert.ok(state.value === 'Experte', "score >1 but not Experte");


    t.end();
};

module.exports = [
    {
        test: ballInitialization,
        name: 'initialize ball',
        description: '',
        categories: []
    },
    {
        test: paddleInitialization,
        name: 'initialize paddle',
        description: '',
        categories: []
    },
    {
        test: computerInitialization,
        name: 'initialize computer',
        description: '',
        categories: []
    },
    {
        test: outInitialization,
        name: 'initialize out',
        description: '',
        categories: []
    },
    {
        test: outComputerInitialization,
        name: 'initialize out computer',
        description: '',
        categories: []
    },
    {
        test: ballOut,
        name: 'set state according to score',
        description: '',
        categories: []
    }
];