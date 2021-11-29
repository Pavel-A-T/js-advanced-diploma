import Themes from './themes';
import { getComputerTeam, getTeam } from './generators';
import GameState from './GameState';
import ComputerController from './ComputerController';
import GamePlay from './GamePlay';
import GameStateService from './GameStateService';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.computer = new ComputerController(this.gamePlay, this.gameState);
    this.level = 0;
    Themes.counter = 0;
    this.score = document.getElementById('score');
  }

  init() {
    const theme = Object.values(Themes.themes[this.level])[0];
    this.addListeners(theme);
    this.gameState.positions.push(...getComputerTeam(this.level, this.gameState));
    this.gameState.positions.push(...getTeam(this.level, this.gameState));
    this.cellSelected = this.gameState.positions[this.gameState.positions.length - 1].position;
    this.gamePlay.selectCell(this.cellSelected);
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  addListeners(theme) {
    this.gamePlay.drawUi(theme);
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.onSaveGameClick = () => this.save();
    this.gamePlay.onLoadGameClick = () => this.load();
    this.gamePlay.onNewGameClick = () => this.startNewGame();
  }

  async onCellClick(index) {
    if (this.computer.getGamerTeam() === 0) return;
    const posPersone = this.gameState.getPositionedCharacterByIndex(index);
    if (posPersone && this.gameState.isCharacter(posPersone.character)) {
      this.gamePlay.deselectCell(this.cellSelected);
      this.cellSelected = posPersone.position;
      this.gamePlay.selectCell(index);
      return;
    }
    if (this.gameState.start) {
      // cell is empty
      if (!posPersone) {
        const character = this.gameState.getPositionedCharacterByIndex(this.cellSelected);
        if (character) {
          const move = Math.floor(character.character.defence / 10);
          if (this.gameState.checkIndex(this.cellSelected, move, index)) {
            this.gamePlay.deselectCell(this.cellSelected);
            this.cellSelected = index;
            character.position = index;
            this.gamePlay.redrawPositions(this.gameState.positions);
            this.gamePlay.deselectCell(this.cellSelected);
            this.gamePlay.selectCell(this.cellSelected);
            if (this.nextLevel()) return;
            this.gameState.start = false;
            await this.computer.attackComputer();
            return;
          }
        }
      }
      // atack
      if (this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const attacker = this.getCharacterByIndex(this.cellSelected);
        const target = this.getCharacterByIndex(index);
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        this.gameState.score += damage;
        this.showScore();
        await this.gameState.showDamage(this.gamePlay, target, index, damage);
        if (this.nextLevel()) return;
        this.gameState.start = false;
        await this.computer.attackComputer();
        return;
      }
    }
    const message = 'Недопустимое действие! Повторите ход!';
    GamePlay.showMessage(message);
  }

  onCellEnter(index) {
    if (this.computer.getGamerTeam() === 0) return;
    const character = this.getCharacterByIndex(index);
    if (character) this.gamePlay.setCursor('pointer');
    if (character) this.gamePlay.showCellTooltip(this.showMessage(character), index);
    const positionedCharacter = this.gameState.positions.find((item) => item.position === this.cellSelected);
    const selectedCharacter = positionedCharacter ? positionedCharacter.character : -10;
    if (selectedCharacter < 0) return;
    const step = Math.floor(selectedCharacter.attack / 10);
    const move = Math.floor(selectedCharacter.defence / 10);
    if (this.gameState.checkIndex(this.cellSelected, step, index) && this.gameState.isOpponent(character)) {
      this.gamePlay.setCursor('crosshair');
      this.gamePlay.selectCell(index, 'red');
    } else if (this.gameState.checkIndex(this.cellSelected, move, index) && !this.gameState.isCharacter(character)) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    }
    if (!this.gameState.checkIndex(this.cellSelected, step, index) && this.gameState.isOpponent(character)) {
      this.gamePlay.setCursor('not-allowed');
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    if (this.cellSelected !== index) {
      this.gamePlay.setCursor('auto');
      this.gamePlay.deselectCell(index);
    }
  }

  getCharacterByIndex(index) {
    const person = this.gameState.positions.find((item) => item.position === index);
    if (person) return person.character;
    return null;
  }

  showMessage(character) {
    return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  }

  getElement(index) {
    const cell = this.gamePlay.cells[index];
    return cell.getElementsByClassName('character');
  }

  nextLevel() {
    if (this.computer.getTeam().length === 0) {
      this.level += 1;
      this.gameState.level = this.level;
      Themes.counter = this.level;
      this.level = ((this.level + 1) > 4) ? 0 : this.level;
      if (this.level === 0) {
        this.gameState.positions = [];
        Themes.counter = 0;
      }
      this.init();
      return true;
    }
    return false;
  }

  save() {
    this.gameState.cellActive = this.cellSelected;
    this.gameState.timeCounter = Themes.counter;
    this.gameState.level = this.level;
    this.stateService.save(this.gameState);
  }

  load() {
    const gameState = this.stateService.load();
    this.gameState = new GameState(gameState._level, gameState._start, gameState._cellActive, gameState._positions,
      gameState._timeCounter, gameState._score);
    Themes.counter = this.gameState.timeCounter;
    this.level = this.gameState.level;
    this.computer = new ComputerController(this.gamePlay, this.gameState);
    const theme = Object.values(Themes.themes[Themes.counter])[0];
    this.addListeners(theme);
    if (this.cellSelected) this.gamePlay.deselectCell(this.cellSelected);
    this.cellSelected = this.gameState.cellActive;
    this.gamePlay.selectCell(this.cellSelected);
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  showScore() {
    this.score.innerText = `Score: ${this.gameState.score}`;
  }

  startNewGame() {
    sessionStorage.setItem('this.score', this.gameState.score.toString());
    const gamePlay = new GamePlay();
    gamePlay.bindToDOM(document.querySelector('#game-container'));
    const stateService = new GameStateService(localStorage);
    const gameCtrl = new GameController(gamePlay, stateService);
    gameCtrl.init();
  }
}
