import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    choice: { type: String },
    amount: { type: Number },
    time: { type: Date },
    memberId: { type: Number },
    siteId: { type: String },
});

const bets = mongoose.model("VipSeDie_cuoc", schema);

export { bets as SedieBets };
