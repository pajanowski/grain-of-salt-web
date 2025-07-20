import {RecipeNode} from "@/app/model/recipe-node";
import Dexie, {EntityTable} from "dexie";

const recipeNodesDb = new Dexie('recipe_id_to_node') as Dexie & {
    recipeNodes: EntityTable<
        RecipeNode,
        'id'
    >,
};

const NONE_PARENT_ID = 'None';

recipeNodesDb.version(1).stores({
    recipeNodes: '&id, parentId'
})

export class RecipeNodeStore {
    static getRootRecipes(): Promise<Array<RecipeNode>> {
        return recipeNodesDb.recipeNodes.where({parentId: NONE_PARENT_ID}).toArray();
    }

    static addRecipeNode(recipeNode: RecipeNode): Promise<string> {
        return recipeNodesDb.recipeNodes.add(recipeNode);
    }

    static getRecipeNodeById(id: string): Promise<RecipeNode | undefined> {
        return recipeNodesDb.recipeNodes.get(id);
    }

    static async getRecipeAncestors(id: string): Promise<RecipeNode[]> {
        let curId: string | null = id;
        const ret: RecipeNode[] = [];
        recipeNodesDb.recipeNodes.where({id: curId}).first();
        let nextRecipeNode: RecipeNode | undefined = await recipeNodesDb.recipeNodes.where({id: curId}).first();
        while (nextRecipeNode) {
            ret.push(nextRecipeNode);
            curId = nextRecipeNode.parentId;
            if (curId === undefined) {
                break
            }
            nextRecipeNode = await recipeNodesDb.recipeNodes.where({id: curId}).first();
        }
        return ret;
    }

    static async getRecipeChildren(id: string): Promise<RecipeNode[]> {
        const parent = await this.getRecipeNodeById(id);
        if (parent) {
            const collection = recipeNodesDb.recipeNodes.where({parentId: id});
            return collection.toArray();
        }
        return [];
    }

    static async deleteRecipeAndChildren(id: string): Promise<void> {
        const parent = await recipeNodesDb.recipeNodes.get(id);
        if (parent) {
            const children = await recipeNodesDb.recipeNodes.where({parentId: parent.id}).toArray();
            for (const child of children) {
                await this.deleteRecipeAndChildren(child.id);
            }
            await recipeNodesDb.recipeNodes.where('id').equals(parent.id).delete();
        }
    }

    static truncateTable() {
        return recipeNodesDb.recipeNodes.clear();
    }
}