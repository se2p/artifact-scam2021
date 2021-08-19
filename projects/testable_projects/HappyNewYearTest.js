const unicornInitialization = async function (t) {
    let unicorn = t.getSprites(sprite => sprite.name.includes('Einhorn') || sprite.name.includes('einhorn'))[0];
    t.assert.ok(unicorn.visible === true, 'Unicorn must be visible');
    t.end();
};


const balloonInitialization = async function (t) {
    let balloon = t.getSprites(sprite => sprite.name.includes('Luftballon') || sprite.name.includes('luftballon'))[0];
    t.assert.ok(!balloon.visible, 'balloon must not be visible');
    t.end();
};

const happyNewYearUnicorn = async function (t) {
    let unicorn = t.getSprites(sprite => sprite.name.includes('einhorn') || sprite.name.includes('Einhorn'))[0];
    let stage = t.getStage();
    let currentYear = stage.getVariables(variable => variable.name.includes('aktuelles'))[0];
    let failed = false;
    t.addCallback(() => {
        if (unicorn.sayText === 'Frohes neues Jahr!') {
            failed = true;
        }
    });
    await t.runForTime(5000);
    t.assert.ok(!failed, 'wished happy new year before countdown ends')
    let changedYear = false;
    t.addCallback(() => {
        if (parseInt(currentYear.value, 10) !== 2020) {
            changedYear = true;
        }
    });
    await t.runUntil(() => changedYear === true, 5000);

    t.assert.ok(parseInt(currentYear.value, 10) === 2021, 'it is not 2021');
    await t.runForSteps(20);
    let text = unicorn.sayText;
    t.assert.ok(text.includes('Frohes neues Jahr') === true, 'text must have changed a final time');
    t.end();
};

module.exports = [
    {
        test: unicornInitialization,
        name: 'Unicorn visible',
        description: '',
        categories: []
    },
    {
        test: balloonInitialization,
        name: 'Balloon invisible',
        description: '',
        categories: []
    },
    {
        test: happyNewYearUnicorn,
        name: 'Unicorn say Happy new Year',
        description: '',
        categories: []
    }
];