import { reOrder } from './helpers';

interface dataProps {
  blockStart: number;
  blockEnd: number;
}

export const formatter = (text: string) => {
  const textArr = text.split(/\r?\n/);

  const data: dataProps[] = [];
  let numOfRules = 0;

  textArr.forEach((item, index) => {
    if (item.includes('@')) {
      return;
    }

    if (!item.includes('{') && !item.includes('}')) {
      return;
    }

    if (item.includes('{')) {
      if (data.length <= numOfRules) {
        data.push({ blockStart: index + 1, blockEnd: 0 });

        return;
      } else {
        data[numOfRules].blockEnd = index - 1;

        data.push({ blockStart: index + 1, blockEnd: 0 });

        numOfRules++;

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
      ...(reOrder(textArr.splice(item.blockStart, item.blockEnd - item.blockStart + 1)) as string[]),
    );
  });

  return textArr.join('\n');
};
