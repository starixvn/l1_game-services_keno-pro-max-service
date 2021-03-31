export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l1_game_api_sit:5000",
        authUrl: "http://l1_auth_api_sit:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enabledApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://l1_game_server_sit:5000/api",
        auth: {
            url: "http://l1_auth_api_sit:5000",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend%40517@10.99.99.187:37301/?replicaSet=SabaL2SIT",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "http://1bc1f16e5e794348b154dba584fecbfa@10.99.99.187:803/240",
        logIdentifier: "kenopromax",
        env: "SIT",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: [
        "https://sit.sabagame.net",
        "http://sit.sabagame.net",
        "http://sit-admg.sabagame.net",
        "https://sit-admg.sabagame.net",
        "http://sit-adm.sabagame.net",
        "https://sit-adm.sabagame.net",
    ],
};
