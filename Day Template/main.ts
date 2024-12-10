const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const values:number[] = [];

  lines.forEach((line) => {
    if (part1) {
    } else {
    }
  })
})
