'use client'
import RecipeCard from "@/app/component/recipe.card";
import {RecipeNode} from "@/app/model/recipe-node";
import {useMemo, useRef, useState} from "react";
import RecipeList, {RecipeListHandles} from "@/app/component/recipe.list";
import {Recipe} from "@/app/model/recipe";
import {RecipeService} from "@/app/service/recipe.service";
import DebugMenu from "@/app/component/debug.menu";
import {useLiveQuery} from "dexie-react-hooks";


export default function Home() {
    const [recipeNode, setRecipeNode] = useState<RecipeNode | undefined>(undefined);
    const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
    const [parent, setParent] = useState<RecipeNode | undefined>(undefined);
    const [children, setChildren] = useState<RecipeNode[]>([]);
    const recipeListRef = useRef<RecipeListHandles>(null);
    const rootRecipes = useLiveQuery(() => RecipeService.getRootRecipes());

    useMemo(() => {
        if (recipeNode && rootRecipes) {
            RecipeService.getRecipeFromNodeId(recipeNode.id)
                .then(setRecipe)
                .catch(console.error);
            if (recipeNode.parentId) {
                RecipeService.getRecipeNodeFromId(recipeNode.parentId)
                    .then(setParent)
                    .catch(console.error);
            }
            RecipeService.getRecipeChildren(recipeNode.id)
                .then((children) => {
                    setChildren(children);
                })
                .catch(console.error);
        }
    }, [recipeNode, rootRecipes])

    return (
        <>
            <DebugMenu/>
            <div className={"flex flex-row w-full bg-gray-200"}>
                <RecipeList className={"w-xs"} ref={recipeListRef}
                            recipeSelected={setRecipeNode}
                            childrenNodes={rootRecipes}
                />
                {children &&
                    <RecipeList recipeSelected={setRecipeNode} parent={parent} childrenNodes={children} />
                }
                {recipe &&
                    <RecipeCard recipe={recipe}/>
                }
            </div>
        </>
    );
}
