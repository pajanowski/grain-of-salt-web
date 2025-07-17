import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {RecipeNode} from "@/app/model/recipe-node";

const NONE_PARENT_ID = 'None';
export class RecipeService {

    static saveRecipeNode(recipeNode: RecipeNode) {
        RecipeNodeStore.addRecipeNode(recipeNode);
    }

    static saveRootRecipe(recipeNode: RecipeNode) {
        if (recipeNode.parentId != null && recipeNode.parentId != NONE_PARENT_ID) {
            throw new Error(`${recipeNode.parentId} can't be saved as a parent because it has an id`);
        }
        recipeNode.parentId = NONE_PARENT_ID;
        return RecipeNodeStore.addRecipeNode(recipeNode);
    }

    static getRootRecipes(): Promise<RecipeNode[]> {
        return RecipeNodeStore.getRootRecipes();
    }
}