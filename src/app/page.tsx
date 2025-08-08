'use client'
import RecipeCard from "@/app/component/recipe.card";
import {RecipeNode} from "@/app/model/recipe-node";
import {useMemo, useRef, useState} from "react";
import RecipeList, {RecipeListHandles} from "@/app/component/recipe.list";
import {Recipe} from "@/app/model/recipe";
import {RecipeService} from "@/app/service/recipe.service";
import DebugMenu from "@/app/component/debug.menu";
import {useLiveQuery} from "dexie-react-hooks";
import RecipeSearch from "@/app/component/recipe.search";
import Link from "next/link";
import RecipeTreeView from "@/app/component/recipe.tree.view";
import {useSearchParams} from "next/navigation";


export default function Home() {
    const [recipeNode, setRecipeNode] = useState<RecipeNode | undefined>(undefined);
    const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
    const [parent, setParent] = useState<RecipeNode | undefined>(undefined);
    const [children, setChildren] = useState<RecipeNode[]>([]);
    const recipeListRef = useRef<RecipeListHandles>(null);
    const rootRecipes = useLiveQuery(() => RecipeService.getRootRecipes());
    const searchParams = useSearchParams();
    const rootId = searchParams.get('rootId');
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeNode | undefined>(undefined);

    const handleSelectRecipe = (recipe: RecipeNode) => {
        setSelectedRecipe(recipe);
    };

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
            <div className="flex justify-between items-center m-4">
                <RecipeSearch onSelectRecipe={setRecipeNode} className="flex-grow"/>
            </div>
            <RecipeTreeView
                rootRecipeId={rootId || undefined}
                selectedRecipeId={selectedRecipe?.id}
                onSelectRecipe={handleSelectRecipe}
                className="bg-white p-4 rounded-lg shadow-md"
            />
        </>
    );
}
