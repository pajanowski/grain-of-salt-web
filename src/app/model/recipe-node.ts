import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";
import {ChangeList} from "@/app/model/change.list";

export class RecipeNode {
  id: string;
  parentId: string | null;
  name: string;
  ingredients: ChangeList<Ingredient>;
  directions: ChangeList<Direction>;

  constructor(
      id: string,
      parentId: string | null,
      name: string,
      ingredients?: ChangeList<Ingredient>,
      directions?: ChangeList<Direction>
  ) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.ingredients = ingredients ?? new ChangeList();
    this.directions = directions ?? new ChangeList();
  }
}