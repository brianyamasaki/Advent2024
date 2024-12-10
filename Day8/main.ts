const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = true;

type Antennas = {
  [key: string]: number[][];
};

const regexAntenna = /\d|[a-zA-Z]/g;

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const mapAntennas:Antennas = {};

  lines.forEach((line, row) => {
    readAntennas(line, row, mapAntennas);
  })
  const antinodes = findAntinodes(mapAntennas, lines[0].length, lines.length);
  filterNodeOverlap(mapAntennas, antinodes);
  console.log(antinodes.length);
})

const readAntennas = (line:string, row: number, antennas:Antennas) => {
  const matches = line.matchAll(regexAntenna);

  for (const match of matches) {
    const type = match[0];
    if (antennas[type]) {
      antennas[type].push([row, match.index]);
    } else {
      antennas[type] = [[row, match.index]]
    }
  }
}

const isValidNode = (loc:number[], rowMax:number, colMax:number) => (loc[0] >= 0 && loc[0] < rowMax && loc[1] >= 0 && loc[1] < colMax);

const findAntinodes = (mapAntennas:Antennas, rowMax:number, colMax:number):number[][] => {
  const antiT: number[][] = [];
  const keys = Object.keys(mapAntennas);
  for (let ikey = 0; ikey < keys.length; ikey += 1) {
    const antennas = mapAntennas[keys[ikey]];
    for (let i = 0; i < antennas.length - 1; i += 1) {
      for (let j = i + 1; j < antennas.length; j += 1) {
        calcAntinodes(antennas[i], antennas[j], antiT, rowMax, colMax);
      }
    }
  }
  return antiT;
}

const calcAntinodes = (loc1:number[], loc2:number[], antinodes:number[][], rowMax:number, colMax:number) => {  
  const [ oneX, oneY] = loc1;
  const [ twoX, twoY] = loc2;
  const rowDiff = oneX - twoX;
  const colDiff = oneY - twoY;
  let newNode:number[];
  let isValid = true;

  newNode = [oneX, oneY];
  do {
    newNode = [newNode[0] + rowDiff, newNode[1] + colDiff];
    isValid = isValidNode(newNode, rowMax, colMax);
    if (isValid) {
      antinodes.push(newNode);
    }
  } while (isValid);

  newNode = [twoX, twoY];
  do {
    newNode = [newNode[0] - rowDiff, newNode[1] - colDiff];
    isValid = isValidNode(newNode, rowMax, colMax);
    if (isValid) {
      antinodes.push(newNode);
    }
  } while (isValid);
}


const filterNodeOverlap = (mapAntennas:Antennas, antinodes: number[][]) => {
  const keys = Object.keys(mapAntennas);
  for (let ikey = 0; ikey < keys.length; ikey += 1) {
    const antennas = mapAntennas[keys[ikey]];
    antennas.forEach(locA => {
      let iFound = antinodes.findIndex((locNode, iNode) => locA[0] === locNode[0] && locA[1] === locNode[1]);
      if (iFound !== -1) {
        antinodes.splice(iFound, 1);
      }
    })
  }
}