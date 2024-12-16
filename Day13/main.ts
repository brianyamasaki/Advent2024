const test = true;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;

enum Itype {
  Null,
  BtnA = 1,
  BtnB,
  Prize
};

type Inst = {
  type: Itype;
  x:number;
  y:number;
};

type Result = {
  cbtnA:number;
  cbtnB:number;
  success: boolean;
}

type Success = {
  costA: number,
  costB: number
};

const prizeCorrect = part1 ? 0 : 10000000000000;

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const insts:Inst[] = [];
  const successes:Success[] = [];

  lines.forEach((line) => {
    if (line.length > 2) {
      insts.push(readLine(line));
      if (insts.length % 3 === 0) {
        const {cbtnA, cbtnB, success} = canAchieve(insts.slice(insts.length - 3));
        if (success) {
          successes.push({costA: cbtnA * 3, costB: cbtnB * 1});
        }
      }
    }
  });
  console.log(successes.reduce((acc, success)=>(acc + (success.costA + success.costB)), 0));

})

const strBtnA = "Button A: ";
const cchBtnA = strBtnA.length;
const strBtnB = "Button B: ";
const cchBtnB = strBtnB.length;
const strPrize = "Prize: ";
const cchPrize = strPrize.length;

const getInt = (token: string) => {
  return parseInt(token.slice(2),10);
}

const readLine = (line:string):Inst => {
  let tokens:string[] = [];
  let type:Itype = Itype.Null;
  let x = 0;
  let y = 0;
  if (line.indexOf(strBtnA) === 0) {
    type = Itype.BtnA;
    tokens = line.slice(cchBtnA).split(", ");
  } else if (line.indexOf(strBtnB) === 0) {
    type = Itype.BtnB;
    tokens = line.slice(cchBtnB).split(", ");
  } else if (line.indexOf(strPrize) === 0) {
    type = Itype.Prize;
    tokens = line.slice(cchPrize).split(", ");
  } 
  if (type !== Itype.Null) {
    x = getInt(tokens[0]);
    y = getInt(tokens[1]);
  }
  return {
    type,
    x,
    y
  }
}

const canAchieve = (insts:Inst[]):Result => {
  const instA:Inst = insts[0];
  const instB:Inst = insts[1];
  const prize:Inst = insts[2];
  const xA = instA.x;
  const xB = instB.x;
  const yA = instA.y;
  const yB = instB.y;
  const prizeX = prize.x + prizeCorrect;
  const prizeY = prize.y + prizeCorrect;
  const iMax = Math.max(Math.ceil(prizeX / xA), Math.ceil(prizeY / yA));
  console.log(`iMax: ${iMax}, prizeX: ${prizeX}`);
  for (let iBtnA = 0; iBtnA < iMax; iBtnA += 1) {
    const remainder = prizeX - xA * iBtnA;
    if (remainder % xB === 0) {
      const factor = remainder / xB;
      if (prizeY === yA * iBtnA + factor * yB) {
        return {
          cbtnA: iBtnA,
          cbtnB: factor,
          success: true
        };
      }
    }
    if (iBtnA % 100000000 === 0) {
      console.log(`${(iBtnA / iMax) * 100}%`);
    }
  }
  return {
    cbtnA:0,
    cbtnB:0,
    success:false
  };
}