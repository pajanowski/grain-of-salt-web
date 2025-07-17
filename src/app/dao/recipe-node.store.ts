import {RecipeNode} from "@/app/model/recipe-node";
import Dexie, {EntityTable} from "dexie";

const recipeIdToNodeDb = new Dexie('recipe_id_to_node') as Dexie & {
    recipeNodes: EntityTable<
        RecipeNode,
        'id'
    >;
};

recipeIdToNodeDb.version(1).stores({
    recipeNodes: '++id, parentId, name, ingredients, directions'
})

export class RecipeNodeStore {
    static getRootRecipes(): Promise<Array<RecipeNode>> {
        return recipeIdToNodeDb.recipeNodes.where({parentId: null}).toArray();
    }

    static addRecipeNode(recipeNode: RecipeNode): Promise<string> {
        return recipeIdToNodeDb.recipeNodes.add(recipeNode);
    }

    static getRecipeNodeById(id: string): Promise<RecipeNode | undefined> {
        return recipeIdToNodeDb.recipeNodes.get(id);
    }

    static async getRecipeAncestors(id: string): Promise<RecipeNode[]> {
        let curId: string | null = id;
        const ret: RecipeNode[] = [];
        recipeIdToNodeDb.recipeNodes.where({id: curId}).first();
        let nextRecipeNode: RecipeNode | undefined = await recipeIdToNodeDb.recipeNodes.where({id: curId}).first();
        while (nextRecipeNode) {
            ret.push(nextRecipeNode);
            curId = nextRecipeNode.parentId;
            if (curId === undefined) {
                break
            }
            nextRecipeNode = await recipeIdToNodeDb.recipeNodes.where({id: curId}).first();
        }
        return ret;
    }

}