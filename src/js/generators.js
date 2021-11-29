import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import PositionedCharacter from './PositionedCharacter';
import Themes from './themes';
import Daemon from './Daemon';
import Undead from './Undead';
import Zombie from './Zombie';
import Vampire from './Vampire';

const human = 'human';
const computer = 'computer';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  const Random = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const level = Math.floor((Math.random() * maxLevel) + 1);
  yield new Random(level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  for (let i = 0; i < characterCount; i += 1) {
    const random = characterGenerator(allowedTypes, maxLevel);
    result.push(random.next().value);
  }
  return result;
}

function getAllowedTypes(team, level) {
  if (team === human) {
    if (level === 0) {
      return [Bowman, Swordsman];
    }
    return [Bowman, Swordsman, Magician];
  }
  return [Undead, Vampire, Zombie, Daemon];
}

function calculateTeam(team, fields) {
  const arr = team;
  for (let i = 0; i < team.length; i += 1) {
    const cell = Math.floor(Math.random() * fields.length);
    arr[i] = new PositionedCharacter(team[i], fields[cell]);
    fields.splice(cell, 1);
  }
}

export function getTeam(level, gameState) {
  const fields = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
  if (level === 0) {
    const team = generateTeam(getAllowedTypes(human, Themes.counter), level, 2);
    calculateTeam(team, fields);
    return team;
  }

  // Здоровье выживших
  const aliveTeam = gameState.positions.filter((item) => gameState.isCharacter(item.character));
  const gamerTeam = [];
  for (const char of aliveTeam) {
    const attackBefore = char.character.attack;
    const life = char.character.health;
    char.character.attack = Math.max(attackBefore, (attackBefore * (1.8 - life)) / 100);
    if (life + 80 >= 100) char.character.health = 100;
    else char.character.health += 80;
    char.character.level += 1;
    const cell = fields.findIndex((item) => item === char.position);
    if (cell > 0) fields.splice(cell, 1);
  }
  const person = generateTeam(getAllowedTypes(human, 1), level, 1);
  const cell = Math.floor(Math.random() * fields.length);
  const positionedCharacter = new PositionedCharacter(person[0], fields[cell]);
  gamerTeam.push(positionedCharacter);
  return gamerTeam;
}

export function getComputerTeam(level, gameState) {
  const fields = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  const aliveTeam = gameState.positions.filter((item) => gameState.isCharacter(item.character));
  const count = level === 0 ? 2 : aliveTeam.length + 1;
  for (const char of aliveTeam) {
    const cell = fields.findIndex((item) => item === char.position);
    if (cell > 0) fields.splice(cell, 1);
  }
  const team = generateTeam(getAllowedTypes(computer), level, count);
  calculateTeam(team, fields);
  return team;
}
