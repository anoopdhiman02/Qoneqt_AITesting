export const htmlTagRemove = (groupDesc: string) => {
    const cleanString = groupDesc
    .replace(/<\/?br\s*\/?>/gi, '\n') // Replace <br> tags with newlines
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  const lines = cleanString.split('\n').filter(line => line.trim() !== '');
    return lines;
};