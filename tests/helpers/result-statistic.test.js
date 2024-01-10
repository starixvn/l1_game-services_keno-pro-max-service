import { generateResult, getSettlementResult } from "../../src/helpers/result-helper";

describe("result statistic: 100,000 rounds", () => {
    const calculateStreaks = (streaks, settlementResult, continuity) => {
        Object.keys(continuity).forEach((key) => {
            if (settlementResult[key]) {
                continuity[key]++;
            } else {
                if (continuity[key] >= 4) {
                    streaks[key][continuity[key]] = streaks[key][continuity[key]] ?? 0;
                    streaks[key][continuity[key]] += 1;
                }
                continuity[key] = 0;
            }
        });
    };
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = { big: 0, small: 0, odd: 0, even: 0, gold: 0, wood: 0, water: 0, fire: 0, earth: 0 };
            const streaks = { big: {}, small: {}, odd: {}, even: {} };
            const continuity = { big: 0, small: 0, odd: 0, even: 0 };

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                Object.keys(settlementResult).forEach((key) => {
                    statisticResult[key] += +settlementResult[key];
                });
                calculateStreaks(streaks, settlementResult, continuity);
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`streak on mode ${index + 1}: ${JSON.stringify(streaks, null, 2)}`);

            expect(resultPercentage.big).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.small).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.odd).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.even).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.gold).toBeLessThan(11);
            expect(resultPercentage.earth).toBeLessThan(11);
            expect(resultPercentage.wood).toBeLessThan(21);
            expect(resultPercentage.fire).toBeLessThan(21);
            expect(resultPercentage.water).toBeLessThan(40);
        });
    }
});
