import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {RecipeNode} from "@/app/model/recipe-node";

export class RecipeService {

  private saveRecipeNode(recipeNode: RecipeNode) {
    RecipeNodeStore.addRecipeNode(recipeNode);
  }
}