import Chance from "chance";
import { Random, MersenneTwister19937 } from "random-js";
import { shuffle as d3Shuffle } from "d3-array";
import _ from "lodash";

const chance = new Chance();
const random = new Random(MersenneTwister19937.autoSeed());
const seeds = [...Array(81).keys()].slice(1);

const shuffleThenPickOut20ByChance = () => chance.pickset(seeds, 20);

const random20UniqueNumbersByChance = () => chance.unique(chance.natural, 20, { min: 1, max: 80 });

const shuffleThenPickOut20ByRandomJs = () => random.shuffle([...seeds]).slice(0, 20);

const randomlyPick20NumbersByRandomJs = () => random.sample(seeds, 20);

const algorithms = [
    shuffleThenPickOut20ByChance,
    random20UniqueNumbersByChance,
    shuffleThenPickOut20ByRandomJs,
    randomlyPick20NumbersByRandomJs,
];

const random1 = () => {
    const randomSelection = chance.natural({
        min: 0,
        max: algorithms.length - 1,
    });

    return algorithms[randomSelection]();
};

const random2 = () => {
    return d3Shuffle(d3Shuffle(d3Shuffle(seeds))).slice(0, 20);
};

const random3 = () => _.shuffle(_.shuffle(_.shuffle(seeds))).slice(0, 20);

export const randomModes = {
    1: [random1],
    2: [random2],
    3: [random3],
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
