import { Schema, model } from "mongoose";
import { IEntity } from "../interfaces/IEntity";

export interface IBet {
  bet?: number;
  betResult?: number;
}

export interface IRound extends IEntity {
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
    type: [
      {
        bet: Number,
        betResult: Number,
      },
    ],
    required: true,
    default: [],
  },
});

export const RoundModel = model<IRound>("Round", RoundSchema);
