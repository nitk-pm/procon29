function decodePos(code) {
  const arr = code.split(' ');
  return {
    // 0-indexed
    y: parseInt(arr[0], 10) - 1,
    x: parseInt(arr[1], 10) - 1,
  };
}

export default function parseQR(code, myColor) {
  const sections = code.split(':');
  const header = sections[0].split(' ');
  const h = header[0];
  const w = header[1];
  const agents = [
    decodePos(sections[sections.length - 2]),
    decodePos(sections[sections.length - 3]),
  ];
  const body = sections.slice(1, sections.length - 3);
  const tbl =
    body.map(line => line.split(' ').map(score => ({
      score: parseInt(score, 10),
      agent: false,
      color: 'Neut',
    })));
  const rivalColor = myColor === 'Red' ? 'Blue' : 'Red';
  for (let i = 0; i < agents.length; i += 1) {
    const { x, y } = agents[i];
    console.log(agents[i], myColor);
    tbl[y][x].color = myColor;
    tbl[y][x].agent = true;
  }
  return {
    tbl, w, h,
  };
}

