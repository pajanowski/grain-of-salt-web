export class RecipeNode {
  id: string;
  parentId: string | null;
  name: string;
  ingredients: string[];
  directions: string[];


  constructor(id: string, parentId: string | null, name: string, ingredients?: string[], directions?: string[]) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.ingredients = ingredients ?? [];
    this.directions = directions ?? [];
  }
}