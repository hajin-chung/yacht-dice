export const calculateScore = (dices: number[]) => {
  const count = [0, 0, 0, 0, 0, 0, 0];
  const countCount = [0, 0, 0, 0, 0, 0];
  let sum = 0;
  let sumSingles = 0;
  dices.forEach((eye) => {
    count[eye]++;
    sum += eye;
  });
  count.forEach((c, i) => {
    countCount[c]++;
    sumSingles += c * i;
  });

  let isSmallStraight = false;
  let isLargeStraight = false;

  for (let i = 1; i <= 3; i++) {
    let flag = false;
    for (let j = i; j <= i + 3; j++) flag = flag && count[j]! > 0;
    if (flag) {
      isSmallStraight = true;
      break;
    }
  }

  for (let i = 1; i <= 2; i++) {
    let flag = false;
    for (let j = i; j <= i + 4; j++) flag = flag && count[j]! > 0;
    if (flag) {
      isLargeStraight = true;
      break;
    }
  }

  const score = [
    count[1]!,
    count[2]! * 2,
    count[3]! * 3,
    count[4]! * 4,
    count[5]! * 5,
    count[6]! * 6,
    countCount[2] === 1 && countCount[3] === 1 ? sum : 0,
    countCount[4] === 1 ? sum : 0,
    isSmallStraight ? 15 : 0,
    isLargeStraight ? 30 : 0,
    sum,
    countCount[5] === 1 ? 50 : 0,
    sumSingles >= 63 ? 35 : 0,
  ];

  return score;
};
