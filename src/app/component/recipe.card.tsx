import {Children, forwardRef, ReactNode, useRef, useState} from "react";
import {Recipe} from "@/app/model/recipe";
import {ArrowRightStartOnRectangleIcon, PencilIcon} from "@heroicons/react/24/solid";
import RecipeFormModal, {RecipeFormModalHandle} from "@/app/component/recipe.form.modal";

interface RecipeCardProps {
    recipe: Recipe;
    className?: string;
}

interface ListItemsProps {
    title: string;
    children: ReactNode;
}

export interface RecipeCardHandle {
    logFromRecipeNodeCard: () => void
}

const ListItems = (props: ListItemsProps) => {
    const title = props.title;
    const children = props.children;
    return (
        <div className={"flex flex-col gap-1 bg-gray-300 p-3 rounded"}>
            <div className="text-md font-medium mb-2">{title}</div>
            {children && Children.count(children)> 0 &&
                <div className="space-y-2">
                    {children}
                </div>
            }
            {
                !children || Children.count(children) === 0 &&
                <div className="text-gray-500 italic">No {title}</div>
            }
        </div>
    )
}


const RecipeCard = forwardRef<RecipeCardHandle, RecipeCardProps>((props: RecipeCardProps, _ref) => {
    const recipe = props.recipe!;
    const modalRef = useRef<RecipeFormModalHandle>(null);
    const [editType, setEditType] = useState("Edit");

    return (
        <div className={`flex flex-col gap-2 ${props.className || ''}`}>
            <RecipeFormModal recipe={recipe} ref={modalRef} editType={editType}/>
            <div className={"flex flex-row justify-between items-center flex-wrap"}>
                <div className="text-lg font-semibold mr-2">{recipe.name}</div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setEditType("Edit")
                            modalRef.current!.toggle()
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <PencilIcon className={"size-6"}/>
                    </button>
                    <button
                        onClick={() => {
                            setEditType("Fork")
                            modalRef.current!.toggle()
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <ArrowRightStartOnRectangleIcon className={"size-6"}/>
                    </button>
                </div>
            </div>
            <ListItems title={"Ingredients"}>
                {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex flex-col sm:flex-row justify-between">
                        <div className="font-medium">{ingredient.name}</div>
                        <div className="flex flex-row gap-1 text-gray-700">
                            <div>{ingredient.amount}</div>
                            <div>{ingredient.unit}</div>
                        </div>
                    </div>
                ))}
            </ListItems>
            <ListItems title={"Directions"}>
                {recipe.directions.map((direction, index) => (
                    <div key={direction.id} className="pb-2">
                        <div className="flex">
                            <span className="font-medium mr-2">{index + 1}.</span>
                            <span>{direction.content}</span>
                        </div>
                    </div>
                ))}
            </ListItems>
        </div>
    )
});

RecipeCard.displayName = "RecipeNodeCard";

export default RecipeCard;
