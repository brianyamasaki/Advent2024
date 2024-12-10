const test = false;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n/);
  const reports:number[][] = [];
  let csafe = 0;

  lines.forEach((line) => {
    const tokens = line.split(' ');
    const numbers = tokens.map(str => parseInt(str, 10));
    let isSafe = false;
    if (isSafeReport(numbers)) {
      csafe += 1;
      isSafe = true;
    }
    if (!part1) {
      if (!isSafe) {
        if (allowItemRemoval(numbers)) {
          csafe += 1;
        }
      }
    }
  })
  console.log(csafe);
})

const isSafeReport = (report: number[]): boolean => {
  const diff = report[0] - report[1];
  if (diff === 0) return false;
  const loopEnd = report.length - 1;
  const isIncreasing = diff < 0;
  for (let i = 0; i < loopEnd; i += 1) {
    const val = report[i];
    const valNext = report[i+1];
    if (isIncreasing) {
      if (val >= valNext) {
        return false;
      }
      if (val - valNext < -3) {
        return false;
      }
    } else {
      if (val <= valNext) {
        return false;
      }
      if (val - valNext > 3) {
        return false;
      }
    }
  }
  return true;
}

const allowItemRemoval = (report: number[]): boolean => {
  for(let i = 0; i < report.length; i += 1) {
    const altReport = report.filter((val, ival) => (i !== ival))
    if (isSafeReport(altReport)) return true;
  }
  return false;
}