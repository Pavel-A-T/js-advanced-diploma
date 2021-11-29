import GameStateService from '../js/GameStateService';
import GamePlay from '../js/GamePlay';

jest.mock('../js/GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

const stateService = new GameStateService(localStorage);

test('Should mock load success', () => {
  const expected = { level: 1 };
  stateService.load.mockReturnValue(expected);
  const recived = stateService.load();
  expect(recived).toBe(expected);
});

test('Should mock load fail', () => {
  const mocked = stateService.load.mockReturnValue(undefined);
  expect(() => stateService.load(mocked)()).toThrow();
  window.alert = jest.fn();
  GamePlay.showMessage('Ошибка при загрузке игры!');
  expect(window.alert).toBeCalledWith('Ошибка при загрузке игры!');
});
