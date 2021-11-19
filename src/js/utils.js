export function calcTileType(index, boardSize) {
  let koef;
  const area = boardSize * boardSize;
  const lineSize = boardSize - 1;
  if (index === 0) return 'top-left';
  if (index === lineSize) return 'top-right';
  if (index > 0 && index < lineSize) return 'top';
  if (index >= boardSize) {
    koef = Math.floor(index / boardSize);
  }
  if (index === boardSize * koef && koef < lineSize) return 'left';
  if (index === (boardSize * koef + lineSize) && koef < lineSize) return 'right';
  if (index === area - boardSize) return 'bottom-left';
  if (index === area - 1) return 'bottom-right';
  if (index > (area - boardSize) && index < area - 1) return 'bottom';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
