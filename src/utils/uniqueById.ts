export const uniqueById = <T extends { id: string }>(list: T[]): T[] => {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};
