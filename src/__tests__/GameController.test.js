import GameController from "../js/GameController";
import Zombie from "../js/Zombie";
import Magician from "../js/Magician";


test(("тесты на тегированный шаблон"), () => {
  const level = 10;
  const zombie = new Zombie(level);
  const game = new GameController();
  const mag = new Magician(12);
  expect(game.getMessage(zombie)).toBe('🎖10 ⚔25 🛡25 ❤50');
  expect(game.getMessage(mag)).toBe('🎖12 ⚔40 🛡10 ❤50');
});
