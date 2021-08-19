const redInitialization = async function (t) {
    await t.runForSteps(2);
    let red = t.getSprites(sprite => sprite.name.includes('rot') || sprite.name.includes('Rot'))[0];
    t.assert.ok(!red.visible, 'red must not be visible');
    t.end();
};

const cloningRed = async function (t) {
    await t.runForSteps(2);
    let red = t.getSprites(sprite => sprite.name.includes('rot') || sprite.name.includes('Rot'))[0];
    let cloneChecked = false;
    t.addCallback(() => {
        if (!cloneChecked && red.getClones().length !== 0) {
            cloneChecked = true;
        }
    }, true);
    await t.runUntil(() => cloneChecked === true, 3300);
    const clones = red.getClones();
    t.assert.ok(cloneChecked, 'sprite not cloned');
    t.end();
};

const movingRed = async function (t) {
    let red = t.getSprites(sprite => sprite.name.includes('rot') || sprite.name.includes('Rot'))[0];
    const controller = t.getSprites(sprite => sprite.name.includes('Scheibe') || sprite.name.includes('scheibe'))[0];
    const stage = t.getStage();
    const points = stage.getVariables(variable => variable.name.includes('Punkte'))[0];
    const lives = stage.getVariables(variable => variable.name.includes('Leben'))[0];
    const contX = controller.x;
    const contY = controller.y;
    let cloneChecked = false;
    let dist;
    t.addCallback(() => {
        if (!cloneChecked && red.getClones().length !== 0) {
            dist =Math.sqrt((contX - red.x) * (contX - red.x) + (contY - red.y) * (contY - red.y));
            cloneChecked = true;
        }
    });
    await t.runUntil(() => cloneChecked === true, 3300);
    if (cloneChecked) {
        t.assert.ok(cloneChecked, 'sprite not cloned');
        t.assert.ok(parseInt(lives.value, 10) === 3 || parseInt(points.value, 10) === 0, "values changed before 1. clone was made");
        let clone = red.getClones()[0];
        //await t.runUntil(() => red.getClones().length >= 2 || parseInt(lives.value, 10) < 3 || parseInt(points.value, 10) > 0, 8000);
        await t.runForTime(3300);
        t.assert.ok(red.getClones().length >= 1, 'no clones there');
        t.assert.ok(red.getClones().length >= 2 || (clone !== null && red.getClones()[0] !== null && clone !== red.getClones()[0]), 'sprite not cloned 2 times');
        const clones = red.getClones();
        const redClone = clones[clones.length - 1];
        const startX = redClone.x;
        const startY = redClone.y;
        const distanceStart = Math.sqrt((contX - startX) * (contX - startX) + (contY - startY) * (contY - startY));
        await t.runForTime(1000);
        const moveX = redClone.x;
        const moveY = redClone.y;
        const distanceMove = Math.sqrt((contX - moveX) * (contX - moveX) + (contY - moveY) * (contY - moveY));
        t.assert.ok(distanceMove < distanceStart, 'clone did not move to controller');
        t.assert.ok(parseInt(lives.value, 10) < 3 || parseInt(points.value, 10) > 0);
        let touched = false;
        t.onSpriteMoved(() => {
            if (!touched && controller.isTouchingSprite(red.name)) {
                touched = true;
            }
        });
        await t.runUntil(() => touched  === true, 4000);
        let newClonesNumber = red.getClones().length;
        await t.runUntil(() => red.getClones().length !== newClonesNumber, 3300);
        t.assert.ok(dist >= 230, 'Did not reset to bigger 250 '+dist+" da "+ red.getClones().length);
        t.assert.ok(parseInt(lives.value, 10) < 2 || parseInt(points.value, 10) > 1 || (parseInt(lives.value, 10) < 3 && parseInt(points.value, 10) > 0), "must change values");
    } else {
        await t.runUntil(() => parseInt(lives.value, 10) < 3 || parseInt(points.value, 10) > 0, 8000);
        const startX = red.x;
        const startY = red.y;
        const distanceStart = Math.sqrt((contX - startX) * (contX - startX) + (contY - startY) * (contY - startY));
        await t.runForTime(1000);
        const moveX = red.x;
        const moveY = red.y;
        const distanceMove = Math.sqrt((contX - moveX) * (contX - moveX) + (contY - moveY) * (contY - moveY));
        t.assert.ok(distanceMove < distanceStart, 'clone did not move to controller');
        t.assert.ok(parseInt(lives.value, 10) < 3 || parseInt(points.value, 10) > 0);
        let touched = false;
        t.onSpriteMoved(() => {
            if (!touched && controller.isTouchingSprite(red.name)) {
                touched = true;
            }
        });
        await t.runUntil(() => touched  === true, 4000);
        await t.runForSteps(2);
        t.assert.ok(Math.sqrt((contX - red.x) * (contX - red.x) + (contY - red.y) * (contY - red.y)) >= 250, 'Did not reset to bigger 250');
        t.assert.ok(parseInt(lives.value, 10) < 2 || parseInt(points.value, 10) > 1 || (parseInt(lives.value, 10) < 3 && parseInt(points.value, 10) > 0), "must change values");

    }
    t.end();
};

module.exports = [
    {
        test: cloningRed,
        name: 'cloning red ball',
        description: '',
        categories: []
    },
    {
        test: redInitialization,
        name: 'initialize red ball',
        description: '',
        categories: []
    },
    {
        test: movingRed,
        name: 'ball move',
        description: '',
        categories: []
    }
];