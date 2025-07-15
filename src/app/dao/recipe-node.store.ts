import {RecipeNode} from "@/app/model/recipe-node";
import recipeNodeCard from "@/app/component/recipe-node.card";

export class RecipeNodeStore {
  private static recipeIdToNode: Map<string, RecipeNode> = new Map();
  private static rootRecipeIds: Set<string> = new Set();

  static getRootRecipeIds(): Set<string> {
    return this.rootRecipeIds;
  }

  static addRootRecipeNode(recipeNode: RecipeNode) {
    this.rootRecipeIds.add(recipeNode.id);
    this.recipeIdToNode.set(recipeNode.id, recipeNode);
  }

  static addRecipeNode(recipeNode: RecipeNode) {
    this.recipeIdToNode.set(recipeNode.id, recipeNode);
  }

  static getRecipeNodeById(id: string): RecipeNode | undefined {
    return this.recipeIdToNode.get(id);
  }

  static getRecipeAncestors(id: string): RecipeNode[] {
    let curId: string | null = id;
    const ret: RecipeNode[] = [];
    while(curId && this.recipeIdToNode.has(curId)) {
      const nextRecipeNode: RecipeNode = this.recipeIdToNode.get(curId)!;
      ret.push(nextRecipeNode);
      curId = nextRecipeNode.parentId;
    }
    return ret;
  }

}