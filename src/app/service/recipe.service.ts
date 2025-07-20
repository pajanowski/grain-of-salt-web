import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {RecipeNode} from "@/app/model/recipe-node";
import {ChangeList} from "@/app/model/change.list";
import {ChangeType} from "@/app/model/change";

const NONE_PARENT_ID = 'None';
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
}