const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = true;

const up = 0;
const right = 1;
const down = 2;
const left = 3;
const regexGuard = /\^|\>|\<|v/;

let dirMap = new Map();
dirMap.set('^', up);
dirMap.set('>', right);
dirMap.set('v', down);
dirMap.set('<', left);

const nextDirection =  (dir:number):number => {
  return (dir + 1) % 4;
}

type Guard = {
  x:number;
  y:number;
  direction: number;
}

const findGuard = (line:string, guard:Guard, row:number) => {
  const iFound = line.search(regexGuard);
  if (iFound !== -1) {
    guard.x = iFound;
    guard.y = row;
    guard.direction = dirMap.get(line[iFound]);
  }
}

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const map:string[] = [];
  const visitedSquares:number[][] = [];
  let guard:Guard = {
    x:-1,
    y: -1,
    direction:0
  };

  lines.forEach((line, i) => {
    map.push(line)
    findGuard(line, guard, i);
  })
  animateGuard(map, guard, visitedSquares);
  console.log(visitedSquares.length - 1);
  // showVisitedMap(map, visitedSquares);
})

const showVisitedMap = (map:string[], visitedSquares:number[][]) => {
  console.log('Visited Squares');
  const rowLength = map[0].length;
  for (let row = 0; row < map.length; row += 1) {
    let squares:boolean[] = new Array(rowLength);
    visitedSquares.forEach(pair => {
      if (pair[0] === row) {
        squares[pair[1]] = true;
      }
    })
    let strRow = '';
    for (let col = 0; col < rowLength; col += 1) {
      const ch = squares[col] ? '#' : '.';
      strRow += ch
    }
    console.log(strRow);
  }
}

const isBlocked = (map:string[], x:number, y:number):boolean => {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) {
    return false;
  }
  return map[y].charAt(x) === '#';
}

const nextForward = (x:number, y:number, direction:number) => {
  switch (direction) {
    case up:
      y -= 1;
      break;
    case right:
      x += 1;
      break;
    case down:
      y += 1;
      break;
    case left:
      x -= 1;
  }
  return {x, y}
}

const findNextMove = (map:string[], guard:Guard):boolean => {
  let {x, y, direction} = guard;
  for(let i = 0; i < 4; i +=1 ) {
    let ptNext = nextForward(x, y, direction);
    if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) {
      return false;
    }
    if (isBlocked(map, ptNext.x, ptNext.y)) {
      direction = nextDirection(direction);
    } else {
      guard.x = ptNext.x;
      guard.y = ptNext.y;
      guard.direction = direction;

      return true;
    }  
  }
  console.error('cannot turn');
  return false;
}

const recordVisit = (visitedSquares:number[][], x:number, y:number) => {
  const iFound = visitedSquares.findIndex(item => item[0] === x && item[1]===y)
  // console.log(`Move to row ${y} and column ${x}`);
  if (iFound === -1) {
    visitedSquares.push([x, y]);
  }
}

const animateGuard = (map:string[], guard:Guard, visitedSquares:number[][]) => {
  const xMax = map[0].length;
  const yMax = map.length;
  recordVisit(visitedSquares, guard.x, guard.y);

  while (guard.x >= 0 && 
    guard.x < xMax &&
    guard.y >= 0 &&
    guard.y < yMax) 
  {
    if (findNextMove(map, guard)) {
      recordVisit(visitedSquares, guard.x, guard.y);
    } else {
      break;
    }
  }
}


