import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true, index: true },

    choice: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    time: { type: Date },
    memberId: { type: Number },
    siteId: { type: String },
});

const bets = mongoose.model("VipSeDie_cuoc", schema);

export { bets as SedieBets };
