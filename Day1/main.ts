const test = true;
const dataFile = false ? './test.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n/);
  const leftValues:number[] = [];
  const rightValues: number[] = [];
  let distanceResults: number[] = [];
  let similarityScore: number[] = [];

  lines.forEach((line) => {
    readLine(line, leftValues, rightValues);
  })
  if (part1) {
    leftValues.sort((a,b) => (a-b));
    rightValues.sort((a,b) => (a-b));
    distanceResults = leftValues.map((val, i) => (Math.abs(val - rightValues[i])));
    console.log(distanceResults.reduce((acc, val) => (acc + val), 0));
  } else {
    similarityScore = leftValues.map((leftVal) => {
      const foundList = rightValues.filter((rightVal) => leftVal === rightVal);
      return foundList.length * leftVal;
    });
    // console.log(similarityScore);
    console.log(similarityScore.reduce((acc, val) => (acc + val), 0));
  }
})

const readLine = (line:string, leftValues: number[], rightValues: number[]) => {
  const tokens = line.split('  ');
  leftValues.push(parseInt(tokens[0], 10));
  rightValues.push(parseInt(tokens[1], 10));
}
