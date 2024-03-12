import { stub, stubMongoose } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core, Table } from "sc-game-base";

import constants from "../../src/constants";
import KenoProMaxBot from "../../src/crons/keno-pro-max-bot";
import gameSettings from "../../src/game-settings";

const definition = new Table.TableGameDefinition(gameSettings);
const gameData = new Table.TableGameData(0);
const publisher = stub(Core.BaseEventPublishers);
/** @type {mongoose.Model}*/
/** @type {mongoose.Model}*/
const tempBetsRepository = stubMongoose(mongoose.Model);
const userInfosRepository = stubMongoose(mongoose.Model);
const kenoProMaxBot = new KenoProMaxBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
const bot = {
    id: 1,
    name: "bot1",
    red: 1000,
    type: true,
    choices: [],
    remainTickets: 3,
    totalBet: 0,
    betOnChoices: { ...constants.resetTotalBets },
};
const totalBetTemplate = {
    big: 300,
    small: 500,
    odd: 0,
    even: 0,
    earth: 1,
    fire: 1,
    gold: 1,
    water: 1,
    wood: 2,
};

gameData.gameConfigs = {
    choices_maxbet: {
        big: 2000,
        small: 2000,
        even: 2000,
        odd: 2000,
        earth: 500,
        fire: 1500,
        gold: 500,
        water: 2000,
        wood: 1500,
    },
    minbet: 1,
    bot_maxbet: 200,
};

describe("KenoProMaxBot inherit test", () => {
    it("should inherit TableGameBot", () => {
        expect(kenoProMaxBot instanceof Table.Crons.TableGameBot);
    });
});

describe("resetAllBotData test", () => {
    it("should call resetAllBets and resetAllBotData", () => {
        jest.spyOn(Table.Crons.TableGameBot.prototype, "resetAllBotData");
        jest.spyOn(KenoProMaxBot.prototype, "resetAllBets");

        kenoProMaxBot.resetAllBotData();

        expect(Table.Crons.TableGameBot.prototype.resetAllBotData).toHaveBeenCalled();
        expect(KenoProMaxBot.prototype.resetAllBets).toHaveBeenCalled();
    });
});

describe("resetAllBets test", () => {
    it("should allBets and smallTickets reset to zero", () => {
        kenoProMaxBot.smallTickets = 4;
        kenoProMaxBot.allBets = {
            big: 3,
            small: 5,
            odd: 2,
            even: 100,
            earth: 35,
            fire: 20,
            gold: 1,
            water: 4,
            wood: 7,
        };

        kenoProMaxBot.resetAllBets();

        expect(kenoProMaxBot.smallTickets).toBe(0);
        expect(kenoProMaxBot.allBets).toEqual(constants.resetTotalBets);
    });
});

describe("getBetChoice test", () => {
    it("should return main options when main bet ratio hasn't reached", () => {
        kenoProMaxBot.allBets = {
            big: 300,
            small: 500,
            odd: 2,
            even: 100,
            earth: 35,
            fire: 20,
            gold: 1,
            water: 4,
            wood: 7,
        };

        const choice = kenoProMaxBot.getBetChoice(bot);

        expect(kenoProMaxBot.mainOpts).toContain(choice);
    });

    it("should return sub options when main and rare bet ratio reached", () => {
        kenoProMaxBot.allBets = {
            big: 400,
            small: 460,
            odd: 0,
            even: 0,
            earth: 0,
            fire: 0,
            gold: 40,
            water: 0,
            wood: 0,
        };

        const choice = kenoProMaxBot.getBetChoice(bot);

        expect(kenoProMaxBot.subOpts).toContain(choice);
    });

    it("should return rare options when main and sub bet ratio reached", () => {
        kenoProMaxBot.allBets.big = 4000;
        kenoProMaxBot.allBets.small = 300;
        kenoProMaxBot.allBets.odd = 350;
        kenoProMaxBot.allBets.even = 150;

        const choice = kenoProMaxBot.getBetChoice(bot);

        expect(kenoProMaxBot.rareOpts).toContain(choice);
    });
});

describe("getMaxBet test", () => {
    it("should return value between min and max bet config", () => {
        const choice = "big";
        const { bot_maxbet, minbet, choices_maxbet } = gameData.gameConfigs;
        const maxBet = Math.min(bot_maxbet, choices_maxbet[choice]);

        const actualResult = kenoProMaxBot.getMaxBet({ ...bot, betOnChoices: { ...totalBetTemplate } }, choice);

        expect(actualResult).toBeWithin(minbet, maxBet);
    });
});

describe("getRandomChoiceFromGroup test", () => {
    test.each`
        group                     | groupName
        ${kenoProMaxBot.mainOpts} | ${"main"}
        ${kenoProMaxBot.subOpts}  | ${"sub"}
        ${kenoProMaxBot.rareOpts} | ${"rare"}
    `("should return options of $groupName group", ({ group }) => {
        const choice = kenoProMaxBot.getRandomChoiceFromGroup(group);

        expect(group).toContain(choice);
    });
});

describe("getTotalAmountOnChoiceGroup test", () => {
    test.each`
        group                     | groupName | expectResult
        ${kenoProMaxBot.mainOpts} | ${"main"} | ${800}
        ${kenoProMaxBot.subOpts}  | ${"sub"}  | ${0}
        ${kenoProMaxBot.rareOpts} | ${"rare"} | ${6}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        kenoProMaxBot.allBets = { ...totalBetTemplate };

        const totalAmountOnGroup = kenoProMaxBot.getTotalAmountOnChoiceGroup(group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getTotalAmountOfBotOnChoiceGroup test", () => {
    test.each`
        group                     | groupName | expectResult
        ${kenoProMaxBot.mainOpts} | ${"main"} | ${800}
        ${kenoProMaxBot.subOpts}  | ${"sub"}  | ${0}
        ${kenoProMaxBot.rareOpts} | ${"rare"} | ${6}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        const betOnChoices = { ...totalBetTemplate };

        const totalAmountOnGroup = kenoProMaxBot.getTotalAmountOfBotOnChoiceGroup({ betOnChoices }, group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getAllBetAmount test", () => {
    it("should return total amount bot bets", () => {
        kenoProMaxBot.allBets = { ...totalBetTemplate };

        const actualResult = kenoProMaxBot.getAllBetAmount();

        expect(actualResult).toEqual(806);
    });
});

describe("isSmallTicket test", () => {
    it("should return true when amount below 50 times minbet", () => {
        const amount = 49;

        const actualResult = kenoProMaxBot.isSmallTicket(amount);

        expect(actualResult).toBe(true);
    });
});

describe("updateBotInRoomData test", () => {
    it("should call super method", () => {
        jest.spyOn(Table.Crons.TableGameBot.prototype, "updateBotInRoomData");

        kenoProMaxBot.updateBotInRoomData(bot, "big", 100, bot.red);

        expect(Table.Crons.TableGameBot.prototype.updateBotInRoomData).toHaveBeenCalled();
    });

    it("should update allBets and small ticket", () => {
        const betAmount = 45;
        kenoProMaxBot.smallTickets = 0;
        kenoProMaxBot.allBets = { ...totalBetTemplate };

        kenoProMaxBot.updateBotInRoomData(bot, "big", betAmount, bot.red);

        expect(kenoProMaxBot.allBets.big).toEqual(totalBetTemplate.big + betAmount);
        expect(kenoProMaxBot.smallTickets).toEqual(1);
    });
});

describe("convertAmountToChip test", () => {
    it("should return chip amount on chip list", () => {
        const amount = 46;

        const chip = kenoProMaxBot.convertAmountToChip(amount);

        expect(constants.chips).toContain(chip);
    });
});

describe("getTotalBetAmount test", () => {
    it("should zero when current bet is undefined", () => {
        const actualResult = kenoProMaxBot.getTotalBetAmount();

        expect(actualResult).toEqual(0);
    });

    it("should return total bet amount", () => {
        const currentBet = { ...totalBetTemplate };

        const actualResult = kenoProMaxBot.getTotalBetAmount(currentBet);

        expect(actualResult).toEqual(806);
    });
});
