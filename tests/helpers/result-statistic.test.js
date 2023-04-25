import { generateResult, getSettlementResult, randomModes } from "../../src/helpers/result-helper";
import gameSettings from "../../src/game-settings";
describe("Result statistic: 10000 times", () => {
    it.each(Object.keys(randomModes))("statistic should have expected result with mode %d", (mode) => {
        // Arrange
        const totalRounds = 100000;
        const streaks = {
            big: {},
            small: {},
            odd: {},
            even: {},
        };

        const streakNumber = 4;
        const longestStreak = 4;
        let occurrences = {};
        let prevResult = {};

        const stats = {
            streaks: { total: 0, big: 0, small: 0, odd: 0, even: 0},
        };

        for (let index = 0; index < totalRounds; index++) {
            const result = generateResult(mode);
            const settlement = getSettlementResult(result);

            gameSettings.hedgeBetGroups.forEach((group) => {
                const currentWinningOption = group.find((choice) => settlement[choice]);

                if (prevResult[currentWinningOption]) {
                    occurrences[currentWinningOption]++;
                } else {
                    if (occurrences[currentWinningOption] >= streakNumber) {
                        stats.streaks.total++;
                        stats.streaks[currentWinningOption]++;

                        if (occurrences[currentWinningOption] >= longestStreak) {
                            streaks[currentWinningOption][occurrences[currentWinningOption]] =
                                streaks[currentWinningOption][occurrences[currentWinningOption]] ?? 0;
                            streaks[currentWinningOption][occurrences[currentWinningOption]]++;
                        }
                    }

                    occurrences[currentWinningOption] = 1;
                }
            });

            prevResult = settlement;

            Object.keys(settlement).reduce((choiceResults, choice) => {
                stats[choice] = stats[choice] ?? { count: 0, ratio: 0 };
                stats[choice].count += settlement[choice] ? 1 : 0;
                stats[choice].ratio = stats[choice].count / totalRounds;
            }, {});
        }

        //Assert      
        console.log(`======== Run ${totalRounds} rounds for mode ${mode} ========`);
        console.log(stats);
        expect(stats["big"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["small"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["odd"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["even"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["gold"].ratio).toBeGreaterThanOrEqual(0.05);
        expect(stats["wood"].ratio).toBeGreaterThanOrEqual(0.19);
        expect(stats["water"].ratio).toBeGreaterThanOrEqual(0.38);       
        expect(stats["fire"].ratio).toBeGreaterThanOrEqual(0.2);
        expect(stats["earth"].ratio).toBeGreaterThanOrEqual(0.1);   
    });
});
