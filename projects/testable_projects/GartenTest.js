const gardnerInitialization = async function (t) {
    await t.runForSteps(2);
    let gardener = t.getSprites(sprite => sprite.name.includes('rtnerin'))[0];
    t.assert.ok(gardener.visible, 'Gardner must be visible');
    t.end();
};

const flowerInitialization = async function (t) {
    await t.runForSteps(2);
    let flower = t.getSprites(sprite => sprite.name.includes('Blume'))[0];
    t.assert.ok(flower.visible, 'flower must be visible');
    t.end();
};

const cactusInitialization = async function (t) {
    await t.runForSteps(2);
    let cactus = t.getSprites(sprite => sprite.name.includes('Kaktus'))[0];
    t.assert.ok(!cactus.visible, 'cactus must not be visible');
    t.end();
};

const cactusMove = async function (t) {
    const dist = function (sprite1, sprite2) {
        const distX = sprite1.x - sprite2.x;
        const distY = sprite1.y - sprite2.y;
        return Math.sqrt(distX * distX + distY * distY);
    };

    await t.runForSteps(2);
    let cactus = t.getSprites(sprite => sprite.name.includes('Kaktus'))[0];
    let gardener = t.getSprites(sprite => sprite.name.includes('rtnerin'))[0];
    let flower = t.getSprites(sprite => sprite.name.includes('Blume'))[0];
    let enoughClones = false;
    t.addCallback(() => {
        if (cactus.getClones().length >= 2) {
            enoughClones = true;
        }
    });
    await t.runUntil(() => enoughClones === true, 6000);
    t.assert.ok(enoughClones, 'cactus must have cloned two times');
    let firstCactus = cactus.getClones()[0];
    let secondCactus = cactus.getClones()[1];
    let firstX = firstCactus.x;
    let firstY = firstCactus.y;
    let secondX = secondCactus.x;
    let secondY = secondCactus.y;
    let touchingCactus1 = false;
    let touchingCactus2 = false;
    t.addCallback(() => {
        if (Math.abs(firstCactus.y - gardener.y) <= 5) {
            if (t.isKeyDown('Up')) {
                t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            }
            if (t.isKeyDown('Down')) {
                t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            }
        } else if (firstCactus.y < gardener.y) {
            t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Down', isDown: true});
        } else if (firstCactus.y > gardener.y) {
            t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Up', isDown: true});
        }
        if (Math.abs(firstCactus.x - gardener.x) <= 5) {
            if (t.isKeyDown('Left')) {
                t.inputImmediate({device: 'keyboard', key: 'Left', isDown: false});
            }
            if (t.isKeyDown('Right')) {
                t.inputImmediate({device: 'keyboard', key: 'Right', isDown: false});
            }
        } else if (firstCactus.x < gardener.x) {
            t.inputImmediate({device: 'keyboard', key: 'Right', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Left', isDown: true});
        } else if (firstCactus.x > gardener.x) {
            t.inputImmediate({device: 'keyboard', key: 'Left', isDown: false});
            t.inputImmediate({device: 'keyboard', key: 'Right', isDown: true});
        }
        if (gardener.isTouchingSprite(secondCactus.name)) {
            if (t.isKeyDown('Up')) {
                t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            }
            if (t.isKeyDown('Down')) {
                t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            }
            if (t.isKeyDown('Left')) {
                t.inputImmediate({device: 'keyboard', key: 'Left', isDown: false});
            }
            if (t.isKeyDown('Right')) {
                t.inputImmediate({device: 'keyboard', key: 'Right', isDown: false});
            }
            touchingCactus2 = true;
        }
        if (gardener.isTouchingSprite(firstCactus.name)) {
            if (t.isKeyDown('Up')) {
                t.inputImmediate({device: 'keyboard', key: 'Up', isDown: false});
            }
            if (t.isKeyDown('Down')) {
                t.inputImmediate({device: 'keyboard', key: 'Down', isDown: false});
            }
            if (t.isKeyDown('Left')) {
                t.inputImmediate({device: 'keyboard', key: 'Left', isDown: false});
            }
            if (t.isKeyDown('Right')) {
                t.inputImmediate({device: 'keyboard', key: 'Right', isDown: false});
            }
            touchingCactus1 = true;
        }
    });
    await t.runUntil(() => touchingCactus2 || touchingCactus1, 6000);
    t.assert.ok(touchingCactus2 || touchingCactus1, "gardener must have touched cactus");
    let flowerDir = flower.direction;
    let numberClones = cactus.getClones().length;
    let firstDistOrig = Math.sqrt((firstX - gardener.x) * (firstX - gardener.x) + (firstY - gardener.y) * (firstY - gardener.y));
    let secondDistOrig = Math.sqrt((secondX - gardener.x) * (secondX - gardener.x) + (secondY - gardener.y) * (secondY - gardener.y));
    let flowerChanged = false;
    let sayAutsch = false;
    let sayOhje = false;
    t.addCallback(() => {
        if (flowerDir !== flower.direction) {
            flowerChanged = true;
        }
        if (gardener.sayText.includes('Autsch')) {
            sayAutsch = true;
        }
        if (flower.sayText.includes('Ohje')) {
            sayOhje = true;
        }
    });
    await t.runForTime(10000);
    t.assert.ok(sayAutsch, "gardner must say Autsch");
    t.assert.ok(sayOhje, "flower must say Ohje");
    t.assert.ok(!flowerChanged, 'flower changed after gardener touched actus');
    t.assert.ok(firstDistOrig > dist(firstCactus, gardener), 'cactus did not get nearer to gardener');
    t.assert.ok(secondDistOrig > dist(secondCactus, gardener), 'cactus did not get nearer to gardener');
    if (cactus.getClones().length > numberClones) {
        t.assert.ok(dist(gardener, cactus.getClones()[cactus.getClones().length - 1]) < 2);
    }
    t.end();
};


module.exports = [
    {
        test: gardnerInitialization,
        name: 'initialize gardener',
        description: '',
        categories: []
    },
    {
        test: flowerInitialization,
        name: 'initialize flower',
        description: '',
        categories: []
    },
    {
        test: cactusInitialization,
        name: 'initialize cactus',
        description: '',
        categories: []
    },
    {
        test: cactusMove,
        name: 'cactus move',
        description: '',
        categories: []
    }
];