const test = false;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  let calibrationResult = 0;

  lines.forEach((line) => {
    const equation = readEquation(line);
    if (part1) {
      if (canSolveEquation(equation)) {
        calibrationResult += equation[0];
      }
    } else {
      if (trySolutionThreeOp(equation[0], equation.slice(1), opAdd) ||
        trySolutionThreeOp(equation[0], equation.slice(1), opMul) ||
        trySolutionThreeOp(equation[0], equation.slice(1), opConcat)
        ) 
      {
        calibrationResult += equation[0];
      }

    }
  })
  console.log(calibrationResult);
})

const readEquation = (line:string) : number[] => {
  const eqSides = line.split(': ');
  const result = [parseInt(eqSides[0])];
  const operands = eqSides[1].split(' ').map(str => (parseInt(str, 10)));
  return result.concat(operands);
}

const opMul = 1;
const opAdd = 2;
const opConcat = 3;

const canSolveEquation = (equation: number[]):boolean => {
  const eqResult = equation[0];
  const operands = equation.slice(1);
  
  if (trySolution(eqResult, operands, opMul)) {
    return true;
  }
  if (trySolution(eqResult, operands, opAdd)) {
    return true;
  }

  return false;
}

const trySolution = (eqResult: number, operands:number[], op:number): boolean => {
  let newVal;
  if (op === opMul) {
    newVal = operands[0] * operands[1];
  } else {
    newVal = operands[0] + operands[1];
  }
  if (operands.length === 2) {
    return newVal === eqResult;
  }
  const newOperands = [newVal].concat(operands.slice(2));
  if (trySolution(eqResult, newOperands, opMul)) {
    return true;
  }
  if (trySolution(eqResult, newOperands, opAdd)) {
    return true;
  }
  return false;
  
}

const trySolutionThreeOp = (eqResult: number, operands:number[], op:number): boolean => {
  let newVal;

  switch (op) {
    case opMul:
      newVal = operands[0] * operands[1];
      break;
    case opAdd:
      newVal = operands[0] + operands[1];
      break;
    case opConcat:
      newVal = parseInt(operands[0].toString() + operands[1].toString(), 10);
      break;
  }

  if (operands.length === 2) {
    return newVal === eqResult;
  }
  const newOperands = [newVal].concat(operands.slice(2));
  if (trySolutionThreeOp(eqResult, newOperands, opMul)) {
    return true;
  }
  if (trySolutionThreeOp(eqResult, newOperands, opAdd)) {
    return true;
  }
  if (trySolutionThreeOp(eqResult, newOperands, opConcat)) {
    return true;
  }
  return false;
  
}