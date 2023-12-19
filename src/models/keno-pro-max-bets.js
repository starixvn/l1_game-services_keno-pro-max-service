import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    odd: { type: Number, default: 0 },
    even: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    wood: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    earth: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: String },
    roundId: { type: Number, required: true },
    paid: { type: Boolean, default: false },
};
const bets = mongoose.model(
    "KenoProMax_cuoc",
    new mongoose.Schema({
        ...bet,
        rate: { type: Number, required: true },
        currency: { type: String, required: true },
        operatorId: { type: String, required: true },
    })
);
const tmpBets = mongoose.model("KenoProMax_tmpcuoc", new mongoose.Schema(bet));

export { bets as KenoProMaxBets, tmpBets as KenoProMaxTmpBets };
