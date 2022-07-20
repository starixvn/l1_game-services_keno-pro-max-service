import { generateResult, getSettlementResult } from "../../src/helpers/result-helper";

describe("generateResult test", () => {
    const testCases = [{ randomMode: undefined }, { randomMode: 1 }, { randomMode: 2 }, { randomMode: 3 }];
    it.each(testCases)("should return 20 numbers having value between 1 and 80", ({ randomMode }) => {
        const actualResult = generateResult(randomMode);

        expect(actualResult.length).toEqual(20);
        expect(actualResult).toSatisfyAll((number) => number >= 1 && number <= 80);
    });
});

describe("getSettlementResult test", () => {
    const testCases = [
        {
            result: [8, 11, 19, 20, 22, 29, 42, 53, 55, 56, 58, 62, 63, 66, 67, 69, 72, 73, 74, 80],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: true,
                even: false,
                gold: false,
                wood: false,
                water: false,
                fire: false,
                earth: true,
            },
        },
        {
            result: [1, 2, 13, 18, 36, 39, 41, 42, 46, 48, 53, 58, 61, 63, 66, 68, 70, 74, 77, 80],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: false,
                even: true,
                gold: false,
                wood: false,
                water: false,
                fire: false,
                earth: true,
            },
        },
        {
            result: [3, 4, 13, 14, 15, 17, 25, 33, 40, 45, 48, 55, 62, 65, 66, 67, 68, 71, 79, 80],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: false,
                even: true,
                gold: false,
                wood: false,
                water: false,
                fire: true,
                earth: false,
            },
        },
        {
            result: [3, 4, 13, 14, 15, 17, 25, 34, 40, 45, 48, 55, 62, 65, 66, 67, 68, 71, 79, 80],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: true,
                even: false,
                gold: false,
                wood: false,
                water: false,
                fire: true,
                earth: false,
            },
        },
        {
            result: [1, 3, 4, 8, 15, 21, 23, 28, 36, 44, 46, 47, 60, 62, 66, 70, 71, 74, 77, 79],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: true,
                even: false,
                gold: false,
                wood: false,
                water: true,
                fire: false,
                earth: false,
            },
        },
        {
            result: [1, 2, 4, 8, 15, 21, 23, 28, 36, 44, 46, 47, 60, 62, 66, 70, 71, 74, 77, 79],
            expectSettlementResult: {
                big: true,
                small: false,
                odd: false,
                even: true,
                gold: false,
                wood: false,
                water: true,
                fire: false,
                earth: false,
            },
        },
        {
            result: [2, 5, 8, 11, 12, 19, 25, 28, 31, 34, 43, 47, 53, 54, 57, 65, 66, 68, 69, 80],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: true,
                even: false,
                gold: false,
                wood: false,
                water: true,
                fire: false,
                earth: false,
            },
        },
        {
            result: [1, 5, 8, 11, 12, 19, 25, 28, 31, 34, 43, 47, 53, 54, 57, 65, 66, 68, 69, 80],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: false,
                even: true,
                gold: false,
                wood: false,
                water: true,
                fire: false,
                earth: false,
            },
        },
        {
            result: [6, 8, 12, 13, 16, 19, 20, 23, 28, 34, 35, 40, 42, 51, 53, 56, 70, 74, 75, 80],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: true,
                even: false,
                gold: false,
                wood: true,
                water: false,
                fire: false,
                earth: false,
            },
        },
        {
            result: [5, 8, 12, 13, 16, 19, 20, 23, 28, 34, 35, 40, 42, 51, 53, 56, 70, 74, 75, 80],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: false,
                even: true,
                gold: false,
                wood: true,
                water: false,
                fire: false,
                earth: false,
            },
        },
        {
            result: [2, 10, 11, 13, 14, 17, 20, 21, 24, 29, 32, 38, 42, 43, 44, 47, 54, 58, 61, 73],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: true,
                even: false,
                gold: true,
                wood: false,
                water: false,
                fire: false,
                earth: false,
            },
        },
        {
            result: [1, 10, 11, 13, 14, 17, 20, 21, 24, 29, 32, 38, 42, 43, 44, 47, 54, 58, 61, 73],
            expectSettlementResult: {
                big: false,
                small: true,
                odd: false,
                even: true,
                gold: true,
                wood: false,
                water: false,
                fire: false,
                earth: false,
            },
        },
    ];

    it.each(testCases)("should return correct settlement result", ({ result, expectSettlementResult }) => {
        const actualResult = getSettlementResult(result);

        expect(actualResult).toEqual(expectSettlementResult);
    });
});
