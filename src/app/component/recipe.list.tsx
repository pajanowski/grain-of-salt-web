import {forwardRef} from "react";
import {RecipeNode} from "@/app/model/recipe-node";

interface RecipeListProps {
    className?: string;
    recipeSelected: (recipeNode: RecipeNode | undefined) => void;
    recipeNodes?: RecipeNode[];
}

export interface RecipeListHandles {
    refresh: () => void;
}

const RecipeList = forwardRef<RecipeListHandles, RecipeListProps>((props: RecipeListProps, _ref) => {
    // const [recipeNodes, setRootRecipes] = useState<RecipeNode[] | undefined>([]);
    const recipeNodes = props.recipeNodes;

    if (!recipeNodes) return null;

    return (
        <div className={`bg-gray-300 h-full ${props.className}`}>
            {recipeNodes.length > 0 && recipeNodes.map((recipe) => {
                return (<div key={recipe.id} onClick={() => props.recipeSelected(recipe)}>
                    {recipe.name}
                </div>)
            })}
            {recipeNodes.length == 0 &&
                <div> No recipes yet</div>
            }
        </div>
    )
});

RecipeList.displayName = 'RecipeList';

export default RecipeList;
