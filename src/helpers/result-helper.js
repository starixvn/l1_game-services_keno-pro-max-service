import Chance from "chance";
import { Random, MersenneTwister19937 } from "random-js";
import { shuffle as d3Shuffle } from "d3-array";
import _ from "lodash";

const chance = new Chance();
const random = new Random(MersenneTwister19937.autoSeed());
const seeds = [...Array(81).keys()].slice(1);

const shuffleSeeds = (arr) => {
    for (let i = arr.length - 1; i >= 0; i -= 2) {
        const randomCardIndex = Math.floor(chance.floating({ min: 0, max: 1 }) * (i + 1));
        const term = arr[i];

        arr[i] = arr[randomCardIndex];
        arr[randomCardIndex] = term;
    }
};

const random1 = () => {
    const arr = [...seeds];

    shuffleSeeds(arr);
    shuffleSeeds(arr);
    shuffleSeeds(arr);

    return arr.slice(0, 20);
};

const random2 = () => chance.shuffle(chance.shuffle(chance.shuffle(seeds))).slice(0, 20);

const random3 = () => {
    return d3Shuffle(d3Shuffle(d3Shuffle(seeds))).slice(0, 20);
};

const random4 = () => _.shuffle(_.shuffle(_.shuffle(seeds))).slice(0, 20);

const random5 = () => chance.pickset(seeds, 20);

const random6 = () => chance.unique(chance.natural, 20, { min: 1, max: 80 });

const random7 = () => random.shuffle([...seeds]).slice(0, 20);

const random8 = () => random.sample(seeds, 20);

const randomModes = {
    1: [random1, random2, random3, random4],
    2: [random5, random6, random7, random8],
    3: [random1, random3, random5, random7],
};

const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints >= 811,
    small: (totalPoints) => totalPoints <= 810,
    odd: (totalPoints) => totalPoints % 2 === 1,
    even: (totalPoints) => totalPoints % 2 === 0,
    gold: (totalPoints) => 210 <= totalPoints && totalPoints <= 695,
    wood: (totalPoints) => 696 <= totalPoints && totalPoints <= 763,
    water: (totalPoints) => 764 <= totalPoints && totalPoints <= 855,
    fire: (totalPoints) => 856 <= totalPoints && totalPoints <= 923,
    earth: (totalPoints) => 924 <= totalPoints && totalPoints <= 1410,
});

export const generateResult = (randomMode) => {
    return chance.pickone(randomModes[randomMode] || randomModes[1])();
};

export const getSettlementResult = (roundResult) => {
    const totalPoints = roundResult.reduce((total, number) => total + number, 0);

    return settlementRuleEntries.reduce((settlementTempResult, [choice, rule]) => {
        settlementTempResult[choice] = rule(totalPoints);

        return settlementTempResult;
    }, {});
};
