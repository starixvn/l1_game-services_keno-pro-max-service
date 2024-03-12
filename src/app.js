import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { startTrace } from "sc-instrument";

startTrace(appConfigs.otel?.enabled, appConfigs.otel?.endpoint, appConfigs.otel?.system, appConfigs.sentry.env, gameSettings.name);

import { Core, Table } from "sc-game-base";

import constants from "./constants";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import KenoProMaxContainerRegistry from "./kenoProMax-container-registry";

const run = async () => {
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound, constants.resetTotalBets);
    const container = new KenoProMaxContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("KenoProMax", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
