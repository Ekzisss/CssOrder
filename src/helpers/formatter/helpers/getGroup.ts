import { tags } from '../../../constants/tags';

export const getGroup = (text: string) => {
  const selector = text.substring(0, text.indexOf(':')).trim();

  return tags[selector] ?? 0;
};
