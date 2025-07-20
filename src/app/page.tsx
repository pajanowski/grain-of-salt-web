'use client'
import RecipeNodeCard, {RecipeNodeCardHandles} from "@/app/component/recipe-node.card";
import {RecipeNode} from "@/app/model/recipe-node";
import {useRef, useState} from "react";
import RecipeList, {RecipeListHandles} from "@/app/component/recipe.list";


export default function Home() {
    const [recipeNode, setRecipeNode] = useState<RecipeNode | undefined>(undefined);
    const recipeListRef = useRef<RecipeListHandles>(null);
    return (
        <>
            <button onClick={() => {
                recipeListRef!.current!.refresh()
            }}>Refresh
            </button>
            <div className={"flex flex-row w-full bg-gray-200"}>
                <RecipeList className={"w-xs"} ref={recipeListRef} recipeSelected={setRecipeNode}/>
                {recipeNode &&
                    <RecipeNodeCard node={recipeNode}/>
                }
            </div>
        </>
    );
}
