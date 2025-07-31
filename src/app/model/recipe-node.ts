import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";
import {ChangeList} from "@/app/model/change.list";
import {v4 as uuid} from "uuid";
export const NONE_PARENT_ID = 'None';

export class RecipeNode {
  id: string;
  parentId: string;
  name: string;
  ingredients: ChangeList<Ingredient>;
  directions: ChangeList<Direction>;

  constructor(
      id?: string,
      parentId?: string,
      name?: string,
      ingredients?: ChangeList<Ingredient>,
      directions?: ChangeList<Direction>
  ) {
    this.id = id ?? uuid();
    this.parentId = parentId ?? NONE_PARENT_ID;
    this.name = name ?? "";
    this.ingredients = ingredients ?? new ChangeList();
    this.directions = directions ?? new ChangeList();
  }

  static empty(): RecipeNode {
      return new RecipeNode();
  }
}
