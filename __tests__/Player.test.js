const Potion = require('../lib/Potion');
jest.mock('../lib/Potion');

console.log(new Potion());

//you do not need to use .js at the end bc node will automatically assume that it is a js file
const Player = require('../lib/Player');

test('creates a player object', () => {
    const player = new Player('Dave');

    expect(player.name).toBe('Dave');
    expect(player.health).toEqual(expect.any(Number));
    expect(player.strength).toEqual(expect.any(Number));
    expect(player.strength).toEqual(expect.any(Number));
    expect(player.inventory).toEqual(
        expect.arrayContaining([expect.any(Object)])
      );
})
