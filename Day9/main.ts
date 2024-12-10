const test = false;
const dataFile = test ? './test.txt' : './input.txt';
const part1 = false;

type Block2 = {
  id: number;
  size: number;
};

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);

  if (part1) {
    const blocks = readBlocks(text);
    // displayBlocksDebug(blocks);
    compactBlocks(blocks);
    displayChecksum(blocks);  
  } else {
    const {rgblock2, cb} = readBlocks2(text);
    // displayBlocks2(rgblock2);
    compactBlocks2(rgblock2, cb);
    // displayBlocks2(rgblock2);
    displayChecksum2(rgblock2);
  }
})

const readBlocks = (text:string):number[] => {
  const blocks:number[] = [];
  for (let ich = 0; ich < text.length; ich += 1) {
    const isEmpty = ich % 2 === 1;
    const id = isEmpty ? -1 : ich / 2;
    const cMax = parseInt(text[ich], 10);
    for (let cb = 0; cb < cMax; cb += 1) {
      blocks.push(id);
    }
  }
  return blocks;
}

const isEmpty = (val) => (val < 0);
const isData = (val) => (val >= 0);

const needsCompacting = (blocks:number[]) => {
  const iFoundFirst = blocks.findIndex(isEmpty);
  const iFoundLast = blocks.findLastIndex(isData);
  return iFoundFirst < iFoundLast;
}

const compactBlocks = (blocks:number[]) => {
  while (true) {
    const iEmptyFirst = blocks.findIndex(isEmpty);
    const iDataLast = blocks.findLastIndex(isData);
    if (iEmptyFirst > iDataLast) {
      break;
    }
    blocks[iEmptyFirst] = blocks[iDataLast];
    blocks[iDataLast] = -1;
    // displayBlocksDebug(blocks);
  } 
}

const findEmptyBlockIndex = (rgblock2:Block2[], size:number):number => {
  for (let j = 0; j < rgblock2.length; j += 1) {
    const block = rgblock2[j];
    if (block.id < 0 && block.size >= size) {
      return j;
    }
  }
  return -1;
}

const compactBlocks2 = (rgblock2:Block2[], cb:number) => {
  for (let idT = cb; idT >= 0; idT -= 1) {
    const iFound = rgblock2.findIndex((block) => block.id === idT);
    if (iFound < 0) break;
    const dataBlock = rgblock2[iFound];
    const iEmpty = findEmptyBlockIndex(rgblock2, dataBlock.size);
    if (iEmpty < 0) continue;
    if (iEmpty  < iFound) {
      const emptyBlock = rgblock2[iEmpty];
      if (emptyBlock.size === dataBlock.size) {
        emptyBlock.id = dataBlock.id;
        dataBlock.id = -1;
      } else {
        rgblock2.splice(iEmpty, 1, {id:dataBlock.id, size:dataBlock.size}, {id: -1, size: emptyBlock.size - dataBlock.size});
        dataBlock.id = -1;
      }
      // displayBlocks2(rgblock2);
    }
  }
}

const displayChecksum = (blocks:number[]) => {
  let result = 0;
  for(let i = 0; i < blocks.length; i += 1) {
    const id = blocks[i]
    if (id > 0) {
      result += i * id;
    }
  }
  console.log(result);
}

const readBlocks2 = (text:string) => {
  const rgblock2: Block2[] = [];
  let ich;
  for (ich = 0; ich < text.length; ich += 1) {
    const isEmpty = ich % 2 === 1;
    const id = isEmpty ? -1 : ich / 2;
    const size = parseInt(text[ich], 10);
    rgblock2.push({
      id,
      size
    })
  }

  return {rgblock2, cb: Math.trunc(ich / 2)};
}

const displayChecksum2 = (rgblock2:Block2[]) => {
  let checksum = 0;
  let ich = 0;
  for (let i = 0; i < rgblock2.length;i += 1) {
    const block = rgblock2[i];
    
    if (block.id >= 0) {
      for (let j = 0; j < block.size; j +=1 ) {
        checksum += ich++ * block.id;
      }
    } else {
      ich += block.size;
    }
  }
  console.log(checksum);

}

// debug only
const displayBlocksDebug = (blocks:number[]) => {
  let display = '';
  let i;
  for (i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const blockId = block < 0 ? '.' : block;
    display += blockId.toString();
  }
  console.log(display);
}

const displayBlocks2 = (blocks:Block2[]) => {
  let display = '';
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const blockId = block.id < 0 ? '.' : block.id.toString();
    display += blockId.repeat(block.size);
  }
  console.log(display);
}
