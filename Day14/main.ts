const test = true;
const dataFile = test ? './test2.txt' : './input.txt';
const part1 = false;

type Robot = {
  loc:number[];
  vel:number[];
};

const xMax = test ? 11 : 101;
const yMax = test ? 7 : 103;

Deno.readTextFile(dataFile).then((text: string) => {
  const lines = text.split(/\r\n|\n/);
  const robots:Robot[] = [];

  lines.forEach((line) => {
    robots.push(readLines(line));
  })
  for (let i = 1; i < 5; i += 1) {
    moveRobots(robots);
    displayRobots(robots);
  }
})

const readLines = (line:string):Robot => {
  let robot:Robot;
  const sides = line.split(' v=');
  const strPos = sides[0].slice(2).split(',');
  const loc = strPos.map(pos => (parseInt(pos, 10)));
  const strVel = sides[1].split(',');
  const vel = strVel.map(vel => (parseInt(vel, 10)));
  return {
    loc,
    vel
  };
}

const moveRobot = (robot:Robot) => {
  let pos = robot.loc[0] + robot.vel[0];
  if (pos < 0) {
    pos = xMax - pos;
  } else if (pos > xMax) {
    pos = pos - xMax;
  }
  robot.loc[0] = pos;
  pos = robot.loc[1] + robot.vel[1];
  if (pos < 0) {
    pos = yMax + pos;
  } else if (pos > yMax) {
    pos = pos - yMax;
  }
  robot.loc[1] = pos;
}

const moveRobots = (robots:Robot[]) => {
  robots.forEach(robot => {
    moveRobot(robot)
  })
}

const displayRobots = (robots:Robot[]) => {
  const map:number[][] = [];
  // initialize map
  for (let row = 0; row < yMax; row += 1) {
    map.push(new Array(xMax).fill(0));
  }
  robots.forEach(robot => {
    const [x, y] = robot.loc;
    map[y][x] += 1;
  });
  for (let y = 0; y < yMax; y += 1) {
    let strRow = '';
    for (let x = 0; x < xMax; x += 1) {
      strRow += map[y][x].toString();
    }
    console.log(strRow);
  }
}