import Character from '../js/Character';
import Zombie from '../js/Zombie';

test(("class Character can't have instance"), () => {
  const level = 10;
  try {
    // eslint-disable-next-line
    new Character(level);
  } catch (e) {
    expect(e.message).toBe("Character can't be called with new");
  }
});

test(('class Character child'), () => {
  const level = 10;
  const zombie = new Zombie(level);
  const expected = {
    level: 10,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'zombie',
  };
  expect(zombie).toEqual(expected);
});
