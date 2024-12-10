const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = true;

const strXmas = 'XMAS';
const strSamx = 'SAMX';
Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\n/);
  const board: string[] = []

  lines.forEach((line) => {
    board.push(line);
  })
  let found = 0;
  found += matchRows(board);
  found += matchRows(rowsToCols(board));
  found += matchRows(diagBoards(board));

  console.log(found);
})

const matchString = (line:string, strMatch: string):number => {
  let found = 0;
  let strLeft = line;
  for (let i = 0; i < line.length;) {
    const iFound = strLeft.indexOf(strMatch);
    if (iFound !== -1) {
      found += 1;
      i += iFound + 4;
      strLeft = strLeft.slice(iFound + 4);
    } else {
      break;
    }
  }
  return found;
}

const matchRows = (board: string[]): number => {
  let found = 0;
  for (let i = 0; i < board.length; i += 1) {
    found += matchString(board[i], strXmas);
    found += matchString(board[i], strSamx);
  }
  return found;
}

const rowsToCols = (board: string[]): string[] => {
  const newBoard: string[] = [];
  const xMax = board[0].length;
  const yMax = board.length;

  for (let y = 0; y < yMax; y += 1) {
    let strCol = '';
    for (let x = 0; x < xMax; x += 1) {
      strCol += board[x].charAt(y);
    }
    newBoard.push(strCol);
  }
  return newBoard;
}

const diagBoards = (board: string[]): string[] => {
  const newBoard: string[] = [];
  const xMax = board[0].length;
  const yMax = board.length;

  // top left to bottom right diagonals
  // bottom left half of board
  for (let y = 0; y < yMax; y += 1) {
    let strCol = '';
    for (let x = 0; x < xMax && x+y < yMax; x += 1) {
      strCol += board[x+y].charAt(x);
    }
    newBoard.push(strCol);
  }
  // top right half of board
  for (let x=1; x < xMax; x +=1) {
    let strCol = '';
    let y = 0;
    for (let inc = 0; x + inc < xMax && y < yMax; inc += 1, y += 1) {
      // console.log('line:', y, x + inc);
      strCol += board[y].charAt(x + inc);
    }
    newBoard.push(strCol);
  }

  // top right to bottom left diagonals - top left side
  for (let y = 0; y < yMax; y += 1) {
    let strCol = '';
    for (let inc = 0; y - inc >= 0 && inc < xMax; inc += 1 ) {
      // console.log('row:', y-inc, inc)
      strCol += board[y-inc].charAt(inc);
    }
    newBoard.push(strCol);
    // console.log('pushed');
  }

  // bottom right side
  for (let x = 1; x < xMax; x += 1) {
    let strCol = '';
    for (let inc = 0; inc < yMax && x + inc < xMax; inc += 1) {
      const yCur = yMax - inc - 1;
      // console.log('row:', yCur, x + inc);
      strCol += board[yCur].charAt(x + inc);
    }
    newBoard.push(strCol);
  }
  return newBoard;
}

