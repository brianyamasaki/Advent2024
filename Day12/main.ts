const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;

type Garden = {
  id:string;
  locs:number[][];
};

type Plot = {
  id: string;
  fUpSimilar: boolean;
  fDownSimilar: boolean;
  fRightSimilar: boolean;
  fLeftSimilar: boolean;
}

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const map:Plot[][] = [];

  lines.forEach((line) => {
    map.push(readLine(line));
  })
  markSimilars(map);

})

const readLine = (line:string):Plot[] => {
  const rgplot:Plot[] = [];
  for (let ch of line) {
    rgplot.push({
      id:ch,
      fUpSimilar: false,
      fDownSimilar: false,
      fRightSimilar: false,
      fLeftSimilar: false
    });
  }

  return rgplot;
}

const markSimilars = (map:Plot[][]) => {
  const rowMax = map.length;
  const colMax = map[0].length;
  for (let row = 0; row  < rowMax; row += 1) {
    for (let col = 0; col < colMax; col += 1) {
      const plot = map[row][col];
      const id = plot.id;
      if (getId(map, row-1, col) === id) {
        plot.fUpSimilar = true;
      }
      if (getId(map, row+1, col) === id) {
        plot.fDownSimilar = true;
      }
      if (getId(map, row, col-1) === id) {
        plot.fLeftSimilar = true;
      }
      if (getId(map, row, col+1) === id) {
        plot.fRightSimilar = true;
      }
    }
  }
}

const alreadySeen = (garden:Garden, loc:number[]):boolean => {
  return garden.locs.find(locT => (loc[0] === locT[0] && loc[1] && locT[1])) ? true : false;
}

const getId = (map:Plot[][], row: number, col: number):string => {
  if (isValidLoc(map, row, col)) {
    return map[row][col].id;
  }
  return '';
}

const isValidLoc = (map:Plot[][], row:number, col:number) => {
  const colMax = map[0].length;
  const rowMax = map.length;

  return row >= 0 && row < rowMax && col >= 0 && col < colMax;
}

// starting from loc, find all "touching" areas marked with the same ch
const floodFind = (map:string[], row:number, col:number, ch:string):number[][] => {
  let resultLocs:number[][] = [];
  if (map[row][col] == ch) {
    // const locUp = [y-1, x];
    // if (isValidLoc(map, locUp)) {
    //   floodFind(map, loc, ch)
    // }
  }
  return resultLocs
}