import { Model } from "mongoose";
import { IEntity } from "../interfaces/IEntity";

export async function seedEntity<TEntity extends IEntity>(
  seed: TEntity[],
  model: Model<TEntity>
): Promise<void> {
  for (const entity of seed) {
    if (!(await model.findOne({ id: entity?.id }))) await model.create(entity);
  }
}
