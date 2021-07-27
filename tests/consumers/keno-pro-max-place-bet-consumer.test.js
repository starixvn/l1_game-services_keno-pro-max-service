import { stub } from "jest-micro-auto-stub";
import { helpers } from "sc-common";
import { Core, Table } from "sc-game-base";

import KenoProMaxPlaceBetConsumer from "../../src/consumers/keno-pro-max-place-bet-consumer";

describe("KenoProMaxPlaceBetConsumer test", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "keno-pro-max" });
    const gameData = new Table.TableGameData();
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);
    const consumer = new KenoProMaxPlaceBetConsumer(definition, gameData, publisher);

    it("should inherit PlaceBetConsumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.PlaceBetConsumer);
    });
});

describe("BettingTimeValidation test", () => {
    const gameDefinition = new Core.GameDefinition({
        durations: {
            placingBets: 30,
            lockingBet: 5,
            shakeThePlateDuration: 3,
        },
    });
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);

    it("should return valid bet, bet on betting time and gameConfig enabled true", () => {
        // arrange
        const gameData = new Table.TableGameData(20);
        gameData.gameConfigs = {
            enabled: true,
            roundId: 1,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);

        // act
        const actualResult = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(actualResult.some((validation) => validation.failure)).toBe(false);
    });

    it("should return invalid bet, gameConfig enabled fail", () => {
        // arrange
        const gameData = new Table.TableGameData(20);
        gameData.gameConfigs = {
            enabled: false,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);

        // act
        const actualResult = consumer.composeBettingTimeValidationCriteria();

        // assert
        expect(actualResult[0].failure).toBe(true);
    });

    it("should return invalid bet, place bet on shaking time", () => {
        // arrange
        const gameData = new Table.TableGameData(31);
        gameData.gameConfigs = {
            enabled: true,
            roundId: 1,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);

        // act
        const criterions = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.cannotPlaceBet },
        });
    });

    it("should return invalid bet, place bet on waiting time", () => {
        // arrange
        const gameData = new Table.TableGameData(34);
        gameData.gameConfigs = {
            enabled: true,
            roundId: 1,
        };

        const consumer = new KenoProMaxPlaceBetConsumer(gameDefinition, gameData, publisher);

        // act
        const criterions = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });
});
