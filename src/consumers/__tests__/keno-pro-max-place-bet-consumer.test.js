import { stub } from "jest-micro-auto-stub";
import { Core, Table } from "sc-game-base";

import KenoProMaxPlaceBetConsumer from "../keno-pro-max-place-bet-consumer";

jest.mock("sc-game-base");

describe("KenoProMaxPlaceBetConsumer test", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "keno-pro-max" });
    const gameData = new Table.TableGameData(0);
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);
    const consumer = new KenoProMaxPlaceBetConsumer(definition, gameData, publisher);

    it("inherit PlaceBetConsumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.PlaceBetConsumer);
    });
});
