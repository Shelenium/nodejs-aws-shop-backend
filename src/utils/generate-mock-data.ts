export const generateMockData = <T>(generateMockItem: () => T, size: number): T[] => {
    const result: T[] = [];
    for (let i = 1; i <= size; i++) {
        result.push(generateMockItem());
    }
    return result;
};
