import tags from './tags';

interface dataProps {
  blockStart: number;
  blockEnd: number;
}

export default function formatter(text: string) {
  const textArr = text.split(/\r?\n/);

  const data: dataProps[] = [];
  let numOfRules = 0;

  let blockStart: null | number = null;

  textArr.forEach((item, index) => {
    if (item.includes('@')) {
      return;
    }

    if (!item.includes('{') && !item.includes('}')) {
      return;
    }

    if (item.includes('{')) {
      if (!blockStart) {
        data.push({ blockStart: index + 1, blockEnd: 0 });
        return;
      }
    }

    if (data.length <= numOfRules) {
      return;
    }

    data[numOfRules].blockEnd = index - 1;
    numOfRules++;
  });

  data.reverse().forEach((item) => {
    textArr.splice(
      item.blockStart,
      0,
      ...(reOrder(textArr.splice(item.blockStart, item.blockEnd - item.blockStart + 1)) as string[])
    );
  });

  return textArr.join('\n');
}

function reOrder(textArr: string[]) {
  if (textArr.length <= 1) {
    return textArr;
  }

  for (let i = 0; i < textArr.length; i++) {
    if (isEmptyOrSpaces(textArr[i])) {
      textArr.splice(i, 1);
    }
  }

  textArr.sort((a, b) => textToSelectorToNum(b) - textToSelectorToNum(a));

  const numArr = [1000, 100, 10, 1, 0];
  let currentIndex = numArr.indexOf(textToSelectorToNum(textArr[0]));

  for (let i = 0; i < textArr.length; i++) {
    const numOfSelector = textToSelectorToNum(textArr[i]);

    if (numOfSelector !== numArr[currentIndex]) {
      textArr.splice(i, 0, '');
      currentIndex = numArr.indexOf(numOfSelector);
      i++;
    }
  }

  return textArr;
}

function isEmptyOrSpaces(str: string) {
  return str === null || str.match(/^ *$/) !== null;
}

function textToSelectorToNum(text: string) {
  let selector = text.substring(0, text.indexOf(':')).trim();

  // @ts-ignore: Unreachable code error
  const temp = tags[selector];

  return temp ? temp : 0;
}
