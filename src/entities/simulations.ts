import { Schema, model } from "mongoose";
import { IEntity } from "../interfaces/IEntity";

export interface ISimulation extends IEntity {
  id: number;
  initialBalance: number;
  currentBalance: number;
  valueBet: number;
  valueBetMultiplier?: number;
  odBet: number;
  betEachXRounds: number;
  history?: [
    {
      od: number;
      balanceBefore: number;
      balanceAfter: number;
      date?: Date;
    }
  ];
}

const SimulationsSchema = new Schema<ISimulation>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  betEachXRounds: {
    type: Number,
    required: true,
  },
  initialBalance: {
    type: Number,
    required: true,
  },
  currentBalance: {
    type: Number,
    required: true,
  },
  valueBetMultiplier: {
    type: Number,
    required: true,
    default: 1,
  },
  valueBet: {
    type: Number,
    required: true,
  },
  odBet: {
    type: Number,
    required: true,
  },
  history: {
    type: [
      {
        od: {
          type: Number,
          required: true,
        },
        balanceBefore: {
          type: Number,
          required: true,
        },
        balanceAfter: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
          required: true,
        },
      },
    ],
    default: [],
  },
});

export const SimulationsModel = model<ISimulation>(
  "Simulations",
  SimulationsSchema
);
