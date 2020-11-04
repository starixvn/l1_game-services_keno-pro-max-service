import { Table } from "sc-game-base";

import PlaceBetConsumer from "./consumers/place-bet-consumer";
import initDatabase from "./models";

export default class Startup extends Table.TableGameStartup {
    /**
     * @param {socketIo.Socket} socketClient
     */
    initSocketRouter(socketClient) {
        const router = new Table.Routers.SocketRouter({
            definition: this.definition,
            gameData: this.gameData,
            placeBetConsumer: new PlaceBetConsumer(this.definition, this.gameData),
        });

        router.init(socketClient);
    }

    async configureServices(app) {
        super.configureServices(app);

        await initDatabase(this.appConfigs.database);
    }
}
