/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

function startGame() {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);
  gameCtrl.init();
}

startGame();

// don't write your code here
