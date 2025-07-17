import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {RecipeNode} from "@/app/model/recipe-node";
import {RecipeService} from "@/app/service/recipe.service";

interface RecipeListProps {
    className?: string;
}

export interface RecipeListHandles {
    refresh: () => void;
}

const RecipeList = forwardRef<RecipeListHandles, RecipeListProps>((props: RecipeListProps, ref) => {
    const [rootRecipes, setRootRecipes] = useState<RecipeNode[]>([]);
    useImperativeHandle(ref, () => ({
        refresh() {
            console.log("hello from logFromRecipeNodeCard");
            loadRootRecipes();
        }
    }));

    function loadRootRecipes() {
        RecipeService.getRootRecipes()
            .then(setRootRecipes)
            .catch((err) => {
                console.error("An error occurred fetch root recipes", err)
            });
    }

    useEffect(() => {
        loadRootRecipes();
    }, [])
    return (
        <div className={`bg-gray-300 h-full ${props.className}`}>
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
