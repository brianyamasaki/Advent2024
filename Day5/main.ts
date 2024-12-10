const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = true;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\n/);
  const rules:number[][] = [];
  const updates:number[][] = [];
  let fRules = true;
  const validUpdates:number[][] = [];

  lines.forEach((line) => {
    if (part1) {
      if (line.length <= 1) {
        fRules = false;
      } else if (fRules) {
        readRule(line, rules)
      } else {
        const update = parseUpdate(line);
        if (confirmPageOrder(update, rules)) {
          validUpdates.push(update);
        }
      }
    } else {
    }
  })
  if (part1) {
    let val = 0;

    validUpdates.forEach(update => {
      val += update[Math.trunc(update.length  / 2)];
    });
    console.log(val);  
  }
})

const readRule = (line:string, rules:number[][]) => {

  const tokens = line.split('|');
  rules.push([parseInt(tokens[0], 10), parseInt(tokens[1], 10)]);
}

const parseUpdate = (line:string): number[] => {
  const tokens = line.split(',');
  const update = tokens.map((token) => (parseInt(token, 10)))
  return update;
}

const confirmPageOrder = (update:number[], rules:number[][]):boolean => {
  let isConfirmed = true;
  for (let i = 0; i < update.length - 1; i += 1) {
    const val1 = update[i];
    const val2 = update[i + 1];
    const useRules = findRules(val1, val2, rules);
    useRules.forEach(rule => {
      if (rule[0] !== val1) {
        isConfirmed = false;
      }})
  }
  return isConfirmed;
}

const findRules = (val1:number, val2: number, rules:number[][]):number[][] => {
  const useRules = rules.filter(rule => rule.indexOf(val1) !== -1 && rule.indexOf(val2) !== -1);
  return useRules;
}