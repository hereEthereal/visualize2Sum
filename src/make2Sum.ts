// twoSumUtils.ts
export function generateTwoSumList(target: number): { numbers: number[], uniquePair: number[] } {
    let numPairs = Math.floor((target - 1) / 2);
    let pairs = [];
    let low = 1;
    let high = target - 1;

    for (let i = 0; i < numPairs; i++) {
        pairs.push([low, high]);
        low++;
        high--;
    }

    let numbers = [];
    let uniquePairIndex = Math.floor(Math.random() * numPairs);
    let uniquePair: number[] = pairs[uniquePairIndex];
    numbers.push(uniquePair[0], uniquePair[1]);

    for (let i = 0; i < numPairs; i++) {
        if (i !== uniquePairIndex) {
            let randomIndex = Math.floor(Math.random() * 2);
            numbers.push(pairs[i][randomIndex]);
        }
    }

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return {
        numbers: numbers,
        uniquePair: uniquePair
    };
}

export function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
}
