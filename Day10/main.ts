const test = false;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const map:number[][] = [];
  let trailheads:number[][] = [];

  lines.forEach((line, irow) => {
    let {row, theads} = readRow(line, irow);
    map.push(row);
    trailheads = trailheads.concat(theads);
  })
    const scores = trailheads.map(loc => {
      const peaks = findTrail(map, loc, 0);
      return peaks.length;
    })
    // console.log(scores.join(', '));
    console.log('sum of scores', scores.reduce((acc, val) => (acc + val),0));
// console.log(`trailheads: ${trailheads.length}`)
})

const readRow = (line:string, irow:number) => {
  const row: number[] = [];
  const theads:number[][] = []
  for (let i = 0; i < line.length; i += 1) {
    const height = parseInt(line[i], 10);
    row.push(height);
    if (height === 0) {
      theads.push([irow, i]);
    }
  }
  return {
    row,
    theads,
  };
}

const findTrail = (map:number[][], loc:number[], curLevel:number):number[][] => {
  const [row, col ] = loc;
  const nextLevel = curLevel + 1;
  let foundPeaks:number[][] = [];
  // found the highest number
  if (curLevel === 9 && map[row][col] === 9) {
    return [[row, col]];
  }
  const rowMax = map[0].length;
  const colMax = map.length;
  if (row > 0 && map[row-1][col] === nextLevel) {
    const peaks = findTrail(map, [row-1, col], nextLevel);
    if (part1) {
      uniqueConcatLoc(foundPeaks, peaks);
    } else {
      foundPeaks = foundPeaks.concat(peaks);
    }
  }
  if (row < rowMax-1 && map[row+1][col] === nextLevel) {
    const peaks = findTrail(map, [row + 1, col], nextLevel);
    if (part1) {
      uniqueConcatLoc(foundPeaks, peaks);
    } else {
      foundPeaks = foundPeaks.concat(peaks);
    }
  }
  if (col > 0 && map[row][col-1] === nextLevel) {
    const peaks = findTrail(map, [row, col-1], nextLevel);
    if (part1) {
      uniqueConcatLoc(foundPeaks, peaks);
    } else {
      foundPeaks = foundPeaks.concat(peaks);
    }
  }
  if (col < rowMax - 1 && map[row][col+1] === nextLevel) {
    const peaks = findTrail(map, [row, col+1], nextLevel);
    if (part1) {
      uniqueConcatLoc(foundPeaks, peaks);
    } else {
      foundPeaks = foundPeaks.concat(peaks);
    }
  }
  return foundPeaks;
}

const uniqueConcatLoc = (summary:number[][], toAdd:number[][]) => {
  toAdd.forEach(locT => {
    if (!summary.find(locS => locS[0] === locT[0] && locS[1] === locT[1])) {
      summary.push(locT);
    }
  })
}