import { checkIsEmptyOrSpaces } from './checkIsEmptyOrSpaces';
import { getGroup } from './getGroup';

export const reOrder = (textArr: string[]) => {
  if (textArr.length <= 1) {
    return textArr;
  }

  // Убираем только лишние пустые строки
  const filtered: string[] = [];
  let prevEmpty = false;

  for (const line of textArr) {
    const empty = checkIsEmptyOrSpaces(line);

    if (empty && prevEmpty) {
      continue;
    }

    filtered.push(line);

    prevEmpty = empty;
  }

  // Свойства (только строки с :)
  const props = filtered.filter((line) => line.includes(':') && !line.includes('{'));

  // Остальное (вложенные селекторы и т.п.)
  const rest = filtered.filter((line) => !props.includes(line));

  props.sort((a, b) => getGroup(b) - getGroup(a));

  const result: string[] = [];
  let prevGroup: number | null = null;

  for (const prop of props) {
    const group = getGroup(prop);

    if (prevGroup !== null && group !== prevGroup) {
      result.push('');
    }

    result.push(prop);

    prevGroup = group;
  }

  return [...result, ...rest];
};
