import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {NONE_PARENT_ID, RecipeNode} from "@/app/model/recipe-node";
import {ChangeList} from "@/app/model/change.list";
import {ChangeType} from "@/app/model/change";
import {Recipe} from "@/app/model/recipe";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";

export class RecipeService {

    static saveRecipeNode(recipeNode: RecipeNode) {
        return RecipeNodeStore.addRecipeNode(recipeNode);
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

    static async getRecipeFromNodeId(nodeId: string): Promise<Recipe> {
        const recipeNodes = await RecipeNodeStore.getRecipeAncestors(nodeId);
        const node = recipeNodes[0];
        const ingredientChangeList: ChangeList<Ingredient>[] = []
        const directionChangeList: ChangeList<Direction>[] = [];
        recipeNodes.forEach((node) => {
            ingredientChangeList.splice(0, 0, node.ingredients);
            directionChangeList.splice(0, 0, node.directions);
        })

        const ingredients = this.collapseChangeLists(ingredientChangeList);
        const directions = this.collapseChangeLists(directionChangeList);

        return new Recipe(node.id, node.name, ingredients, directions);
    }

    static async getRecipeChildren(id: string): Promise<RecipeNode[]> {
        return RecipeNodeStore.getRecipeChildren(id);
    }

    static collapseChangeLists<T>(changeLists: ChangeList<T>[]): T[] {
        const ret: T[] = [];
        changeLists.forEach(change => {
            change.items.forEach((item) => {
                switch (item.changeType as ChangeType) {
                    case 'Add':
                        ret.splice(item.line, 0, item.content!);
                        break;
                    case 'Remove':
                        ret.splice(item.line, 1);
                        break;
                    case 'Replace':
                        ret.splice(item.line, 1, item.content!);
                        break;
                }
            })
        })
        return ret;
    }

    static deleteAll() {
        return RecipeNodeStore.truncateTable()
    }

    static getRecipeNodeFromId(id: string) {
        return RecipeNodeStore.getRecipeNodeById(id);
    }
}
