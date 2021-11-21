import Themes from "./themes";
import {getComputerTeam, getTeam} from "./generators";
import GameState from "./GameState";
import ComputerController from "./ComputerController";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.computer = new ComputerController(this.gamePlay);
    this.level = 1;
  }

  init() {
    this.gamePlay.drawUi(Themes.next());
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    GameState.positions.push(...getTeam(this.level));
    this.cellSelected = GameState.positions[0].position;
    this.gamePlay.selectCell(this.cellSelected);
    GameState.positions.push(...getComputerTeam(this.level));
    this.gamePlay.redrawPositions(GameState.positions);
  }

  onCellClick(index) {
    const posPersone = GameState.getPositionedCharacterByIndex(index);
    if (posPersone && GameState.isCharacter(posPersone.character)) {
      this.gamePlay.deselectCell(this.cellSelected);
      this.cellSelected = posPersone.position;
      this.gamePlay.selectCell(index);
      return;
    }
    if (GameState.start) {
      //cell is empty
      if (!posPersone) {
        const character = GameState.getPositionedCharacterByIndex(this.cellSelected);
        const move = Math.floor(character.character.defence / 10);
        if (GameState.checkIndex(this.cellSelected, move, index)) {
          this.gamePlay.deselectCell(this.cellSelected);
          this.cellSelected = index;
          character.position = index;
          this.gamePlay.redrawPositions(GameState.positions);
          this.gamePlay.deselectCell(this.cellSelected);
          this.gamePlay.selectCell(this.cellSelected);
        }
        if (this.nextLevel()) return;
        GameState.isStart();
        this.computer.attackComputer();
        return;
      }
      //atack
      if (this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const attacker = this.getCharacterByIndex(this.cellSelected);
        const target = this.getCharacterByIndex(index);
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        GameState.showDamage(this.gamePlay, target, index, damage);
        if (this.nextLevel()) return;
        GameState.isStart();
        this.computer.attackComputer();
      }
    }
  }


  onCellEnter(index) {
    const character = this.getCharacterByIndex(index);
    if (character) this.gamePlay.setCursor('pointer');
    if (character) this.gamePlay.showCellTooltip(this.getMessage(character), index);
    const selectedCharacter = GameState.positions.find(item => item.position === this.cellSelected).character;
    const step = Math.floor(selectedCharacter.attack / 10);
    const move = Math.floor(selectedCharacter.defence / 10);
    if (GameState.checkIndex(this.cellSelected, step, index) && GameState.isOpponent(character)) {
      this.gamePlay.setCursor('crosshair');
      this.gamePlay.selectCell(index, 'red');
    } else if (GameState.checkIndex(this.cellSelected, move, index) && !GameState.isCharacter(character)) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    }
    if (!GameState.checkIndex(this.cellSelected, step, index) && GameState.isOpponent(character)) {
      this.gamePlay.setCursor('not-allowed');
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    if (this.cellSelected != index) {
      this.gamePlay.setCursor('auto');
      this.gamePlay.deselectCell(index);
    }
  }

  getCharacterByIndex(index) {
    return GameState.positions.find(item => item.position === index).character;
  }

  getMessage(character) {
    return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  }

  getElement(index) {
    const cell = this.gamePlay.cells[index];
    return cell.getElementsByClassName('character');
  }

  nextLevel() {
    if (this.computer.getTeam().length === 0 || this.computer.getGamerTeam().length === 0) {
      this.level = ++this.level > 4 ? 0 : this.level;
      this.init();
      return true;
    }
  }
}
