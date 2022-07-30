import { Schema, model } from "mongoose";

interface IBet {
  bet?: number;
  betResult?: number;
}

interface IRound {
  date: Date;
  od: number;
  earns: Array<IBet>;
}

const RoundSchema = new Schema<IRound>({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  od: {
    type: Number,
    required: true,
  },
  earns: {
    type: Array<IBet>,
    required: true,
    default: [],
  },
});

export default model<IRound>("Round", RoundSchema);
