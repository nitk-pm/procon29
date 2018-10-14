'use module';

function decodePos(code) {
  console.log(code);
  const arr = code.split(' ');
  return {
    // 0-indexed
    y: parseInt(arr[0], 10) - 1,
    x: parseInt(arr[1], 10) - 1,
  };
}

// ([{x: integer, y: integer}], integer, integer) -> Symmetry
export function checkAgentsSymmetry(positions, w, h) {
  const mirrorX = positions[0].x === w - positions[1].x - 1;
  const mirrorY = positions[0].y === h - positions[1].y - 1;
  if (mirrorX && mirrorY) return 'Point';
  const sameX = positions[0].x === positions[1].x;
  const sameY = positions[0].y === positions[1].y;
  if (mirrorX && sameY) return 'MirrorY';
  if (mirrorY && sameX) return 'MirrorX';
  return 'Asymmetry';
}

export function checkBoardSymmetry(tbl) {
  const { arr, w, h } = tbl;
  let xSymmetry = true;
  let ySymmetry = true;
  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) {
      xSymmetry = (xSymmetry && arr[y][x].score === arr[y][w - x - 1].score);
      ySymmetry = (ySymmetry && arr[y][x].score === arr[h - y - 1][x].score);
    }
  }
  if (xSymmetry) return 'MirrorY';
  if (ySymmetry) return 'MirrorX';
  return 'Asymmetry';
}

// (
//   {tbl: [[{agent: bool, color: string, score: integer}]], w: integer, h: integer},
//   [[{x: integer, y: integer}]],
//   string
// )
// -> {
//   tbl: {tbl: [[{agent: bool, color: string, score: integer}]], w: integer, h: integer},
//   succes: bool
// }
export function placeAgents(tbl, agents, myColor, symmetry) {
  const rivalColor = myColor === 'Red' ? 'Blue' : 'Red';
  const { h, w } = tbl;
  const arr = tbl.arr.map(l => l.map(s => ({ ...s })));
  let cnt = 0;
  for (let i = 0; i < agents.length; i += 1) {
    const { x, y } = agents[i];
    arr[y][x].color = myColor;
    arr[y][x].agent = cnt;
    if (symmetry === 'Point') {
      arr[h - y - 1][x].color = rivalColor;
      arr[h - y - 1][x].agent = cnt;
    } else if (symmetry === 'MirrorX') {
      arr[y][w - x - 1].color = rivalColor;
      arr[y][w - x - 1].agent = cnt;
    } else if (symmetry === 'MirrorY') {
      arr[h - y - 1][x].color = rivalColor;
      arr[h - y - 1][x].agent = cnt;
    }
    cnt += 1;
  }
  return { arr, w, h };
}

export function deducePlacement(tbl, agents) {
  console.log(agents);
  let symmetry = checkAgentsSymmetry(agents, tbl.w, tbl.h);
  if (symmetry === 'Asymmetry') {
    symmetry = checkBoardSymmetry(tbl);
  }
  return symmetry;
}

export function parseQR(code) {
  const sections = code.split(':');
  const header = sections[0].split(' ');
  const h = parseInt(header[0], 10);
  const w = parseInt(header[1], 10);
  const agents = [
    decodePos(sections[sections.length - 2]),
    decodePos(sections[sections.length - 3]),
  ];
  const body = sections.slice(1, sections.length - 3);
  const arr =
    body.map(line => line.split(' ').map(score => ({
      score: parseInt(score, 10),
      agent: -1,
      color: 'Neut',
    })));
  return {
    arr, h, w, agents,
  };
}

