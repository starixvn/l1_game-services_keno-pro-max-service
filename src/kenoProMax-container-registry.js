import awilix from "awilix";
import { Table } from "sc-game-base";

import PlaceBetConsumer from "./consumers/keno-pro-max-place-bet-consumer";
import KenoProMaxSettleRoundConsumer from "./consumers/keno-pro-max-settle-round-consumer";
import { KenoProMaxBot, KenoProMaxGameCron, KenoProMaxProcessBetQueue } from "./crons";
import { KenoProMaxBets, KenoProMaxRounds, KenoProMaxTmpBets } from "./models";

const { asClass, asValue } = awilix;

export default class KenoProMaxContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(KenoProMaxRounds),
            betsRepository: asValue(KenoProMaxBets),
            tempBetsRepository: asValue(KenoProMaxTmpBets),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(KenoProMaxSettleRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(KenoProMaxBot).singleton(),
            gameCron: asClass(KenoProMaxGameCron).singleton().proxy(),
            processBetQueue: asClass(KenoProMaxProcessBetQueue).singleton().proxy(),
        });
    }
}
