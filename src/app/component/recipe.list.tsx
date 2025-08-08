import {forwardRef} from "react";
import {RecipeNode} from "@/app/model/recipe-node";
import Link from "next/link";

interface RecipeListProps {
    className?: string;
    recipeSelected: (recipeNode: RecipeNode | undefined) => void;
    parent?: RecipeNode;
    node?: RecipeNode;
    childrenNodes?: RecipeNode[];
}

interface RecipeListRowProps {
    recipeNode: RecipeNode;
    recipeSelected: (recipeNode: RecipeNode | undefined) => void;
}

export interface RecipeListHandles {
    refresh: () => void;
}

const RecipeListRow = (props: RecipeListRowProps) => {
    const recipeNode = props.recipeNode;
   return (
       <div
           onClick={() => props.recipeSelected(recipeNode)}
           className="flex items-center hover:bg-gray-400 p-2 cursor-pointer"
       >
           <span>{recipeNode.name}</span>
           <Link
               href={`/recipe/${recipeNode.id}`}
               className="ml-2 text-blue-500 text-sm hover:underline"
               onClick={(e) => e.stopPropagation()}
           >
               View
           </Link>
       </div>
   )
}

const RecipeList = forwardRef<RecipeListHandles, RecipeListProps>((props: RecipeListProps, _ref) => {
    const parentNode = props.parent;
    const childrenNodes = props.childrenNodes;

    if (!childrenNodes) return null;

    return (
        <div className={`bg-gray-300 h-full ${props.className}`}>
            {parentNode && (
                <div className="flex flex-row gap-1">
                    <div>Parent: </div>
                    <RecipeListRow recipeNode={parentNode} recipeSelected={() => props.recipeSelected(parentNode)}/>
                </div>
            )}
            {childrenNodes.length > 0 && childrenNodes.map((recipe) => {
                return (
                    <RecipeListRow key={recipe.id} recipeNode={recipe} recipeSelected={() => props.recipeSelected(recipe)}/>
                )
            })}
        </div>
    )
});

RecipeList.displayName = 'RecipeList';

export default RecipeList;
