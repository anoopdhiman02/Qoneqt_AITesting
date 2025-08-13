export const htmlTagRemove = (groupDesc: string) => {
  if (typeof groupDesc !== "string") {
    return [];
  }

  const cleanString = groupDesc
    .replace(/<\/?br\s*\/?>/gi, "\n") // Replace <br> tags with newlines
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  const lines = cleanString
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  return lines;
};