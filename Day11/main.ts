const test = false;
const dataFile = test ? './test2.txt' : './input.txt';
const part1 = false;
let progress = 0;


Deno.readTextFile(dataFile).then((text: string) => {
  // const lines = text.split(/\r\n|\n/);
  // const values:number[] = [];

  // lines.forEach((line) => {
  //   if (part1) {
  //   } else {
  //   }
  // })

  const stones = text.split(' ');
  if (part1) {

    // const stonesArray:string[][] = [];
    let length:number = 0;
    stones.forEach((stone,i) => {
      // stonesArray[i] = [stone];
      length += doBlinks([stone], 75).length;
    })
    console.log(length);
  } else {
    const rgcstones = stones.map((stone, i) => {
      console.log(`stone ${i}`);
      return blinkRecursive(stone, 50);
    })    
    console.log(rgcstones.reduce((acc, val)=> (val + acc), 0));
  }
})

const doBlinks = (stones:string[], c:number): string[] => {
  let stonesT = stones;
  for (let i = 0; i < c; i += 1) {
    stonesT = blink(stonesT);
    console.log(i, stonesT.length);
  }
  return stonesT;
}

const removeLeadingZeroes = (strNum:string): string => {
  return parseInt(strNum, 10).toString();
}

const blink = (stones:string[]):string[] => {
  const newStones:string[] = [];
  stones.forEach(stone => {
    const stoneVal = parseInt(stone, 10);
    if (stoneVal === 0) {
      newStones.push('1');
    } else if (stone.length % 2 === 0) {
      const halfLength = stone.length / 2;
      newStones.push(removeLeadingZeroes(stone.slice(0, halfLength)));
      newStones.push(removeLeadingZeroes(stone.slice(halfLength)));
    } else {
      newStones.push((stoneVal * 2024).toString());
    }
  })
  return newStones;
}

const divisor = 1000000000;
const blinkRecursive = (stone:string, c:number):number => {
  let count = 0;
  progress += 1;
  if (progress % divisor === 0) console.log(progress / divisor);
  if (c === 0) {
    return 1;
  }
  const stoneVal = parseInt(stone, 10);
  if (stoneVal === 0) {
    count += blinkRecursive('1', c - 1);
    // console.log('zero value');
  } else if (stone.length % 2 === 0) {
    const halfLength = stone.length / 2;
    count += blinkRecursive(removeLeadingZeroes(stone.slice(0, halfLength)), c - 1);
    count += blinkRecursive(removeLeadingZeroes(stone.slice(halfLength)), c - 1);
  } else {
    count += blinkRecursive((stoneVal * 2024).toString(), c - 1);
  }
  return count;
}