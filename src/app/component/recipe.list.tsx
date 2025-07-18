import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {RecipeNode} from "@/app/model/recipe-node";
import {RecipeService} from "@/app/service/recipe.service";
import {useLiveQuery} from "dexie-react-hooks";
import {NEAPOLITAN, NY_STYLE, PAPA_JOHNS} from "@/app/static-data";

interface RecipeListProps {
    className?: string;
}

export interface RecipeListHandles {
    refresh: () => void;
}

const RecipeList = forwardRef<RecipeListHandles, RecipeListProps>((props: RecipeListProps, ref) => {
    // const [rootRecipes, setRootRecipes] = useState<RecipeNode[] | undefined>([]);
    const rootRecipes = useLiveQuery(() => RecipeService.getRootRecipes());

    if (!rootRecipes) return null;

    return (
        <div className={`bg-gray-300 h-full ${props.className}`}>
            <button onClick={() => {
                RecipeService.saveRecipeNode(NEAPOLITAN);
                RecipeService.saveRecipeNode(NY_STYLE);
                RecipeService.saveRecipeNode(PAPA_JOHNS);
            }}>Load data</button>
            {rootRecipes.length > 0 && rootRecipes.map((recipe) => {
                return (<div key={recipe.id}>
                    {recipe.name}
                </div>)
            })}
            {rootRecipes.length == 0 &&
                <div> No recipes yet</div>
            }
        </div>
    )
});

RecipeList.displayName = 'RecipeList';

export default RecipeList;
