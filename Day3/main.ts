const test = false;
const dataFile = test ? './test2.txt' : './input.txt';
const part1 = false;


Deno.readTextFile(dataFile).then((text: string) => {

    const valueList = parseText(text);
    console.log(valueList.reduce((acc, val) => (acc + val), 0));
})

enum TokenType {
  LParen = 1,
  RParen,
  Comma,
  Number,
  MulStr,
  Do,
  Dont,
  Junk
};

type Token = {
  str: string;
  type: TokenType;  
};

const codeParenLeft = '('.charCodeAt(0);
const codeParenRight = ')'.charCodeAt(0);
const codeZero = '0'.charCodeAt(0);
const codehNine = '9'.charCodeAt(0);
const codeComma = ','.charCodeAt(0);
const strMul = 'mul';
const strDo = 'do()';
const strDont = "don't()";

const consumeToken = (line: string, ipos: number):Token => {
  const ch = line.slice(ipos, ipos + 1);
  const token:Token = {
    str: ch,
    type: TokenType.Junk
  };
  const lineCurrent = line.slice(ipos);

  // check for 'mul' string
  if (lineCurrent.indexOf(strMul) === 0) {
    return {
      str: strMul,
      type: TokenType.MulStr
    };
  }
  // check for "don't" string
  if (lineCurrent.indexOf(strDont) === 0) {
    return {
      str: strDont,
      type: TokenType.Dont
    };
  }
  // check for 'do' string
  if (lineCurrent.indexOf(strDo) === 0) {
    return {
      str: strDo,
      type: TokenType.Do
    }
  }
  if (isDigit(ch)) {
    return consumeNumber(line,ipos, 3);
  }
  switch (line.charCodeAt(ipos)) {
    case codeParenLeft:
      token.type = TokenType.LParen;
      break;
    case codeParenRight:
      token.type = TokenType.RParen;
      break;
    case codeComma:
      token.type = TokenType.Comma;
      break;
    default: 
      break;
  }
  return token;
}

const isDigit = (ch:string): boolean => {
  const code = ch.charCodeAt(0);
  return (code >= codeZero && code <= codehNine);
}

const consumeNumber = (line: string, ipos: number, maxDigits: number ): Token => {
  let i = 0;
  const numStr = line.slice(ipos);
  while(i < maxDigits) {
    if (isDigit(numStr.slice(i, i+1))) {
      i += 1;
    } else {
      break;
    }
  }
  return  {
    str: numStr.slice(0, i),
    type: i <= maxDigits ? TokenType.Number : TokenType.Junk
  };
}

const bitMulStr = 1;
const bitLParen = 2;
const bitNumber = 4;
const bitComma = 8;
const bitNumber2 = 16;
const bitRParen = 32;

const parseText = (line: string): number[] => {
  let statusBits = 0;
  const finalNumbers:number[] = [];
  let number1 = 0;
  let number2 = 0;
  let fDont = false;

  let i = 0;
  while (i < line.length) {
    const token = consumeToken(line, i);
    switch(token.type) {
      case TokenType.Junk:
        // reset to nothing
        statusBits = 0;
        break;
      case TokenType.MulStr:
        // reset status bits to just MulStr
        statusBits = bitMulStr;
        break;
      case TokenType.LParen:
        if (statusBits !== bitMulStr) {
          statusBits = 0;
        } else {
          statusBits |= bitLParen;
        }
        break;
      case TokenType.Number:
        if (statusBits === 3) {
          statusBits |= bitNumber;
          number1 = parseInt(token.str, 10);
        } else if (statusBits === 15) {
          statusBits |= bitNumber2;
          number2 = parseInt(token.str, 10);
        } else {
          statusBits = 0;
        }
        break;

      case TokenType.Comma: 
        if (statusBits === 7) {
          statusBits |= bitComma;
        } else {
          statusBits = 0;
        }
        break;
      case TokenType.RParen:
        if (statusBits === 31) {
          // valid operation
          if (!fDont) {
            finalNumbers.push(number1 * number2);
          }
        }
        statusBits = 0;
        break;
      case TokenType.Do: 
        statusBits = 0;
        fDont = false;
        break;
      case TokenType.Dont: 
        statusBits = 0;
        fDont = true;
    }
    i += token.str.length;
  }
  return finalNumbers;
}

