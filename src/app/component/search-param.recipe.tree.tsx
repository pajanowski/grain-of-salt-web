import {useSearchParams} from "next/navigation";
import {useState} from "react";
import {RecipeNode} from "@/app/model/recipe-node";
import RecipeTreeView from "@/app/component/recipe.tree.view";

const RecipeTreeViewBySearchParam = () => {
    const searchParams = useSearchParams();
    const rootId = searchParams.get('rootId');
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeNode | undefined>(undefined);

    const handleSelectRecipe = (recipe: RecipeNode) => {
        setSelectedRecipe(recipe);
    };
    return (
        <RecipeTreeView
            rootRecipeId={rootId || undefined}
            selectedRecipeId={selectedRecipe?.id}
            onSelectRecipe={handleSelectRecipe}
            className="bg-white p-4 rounded-lg shadow-md"
        />
    )
}

export default RecipeTreeViewBySearchParam;
