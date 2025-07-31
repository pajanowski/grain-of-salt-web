import {Children, forwardRef, ReactNode, useRef, useState} from "react";
import {Recipe} from "@/app/model/recipe";
import {ArrowRightStartOnRectangleIcon, PencilIcon} from "@heroicons/react/24/solid";
import RecipeFormModal, {RecipeFormModalHandle} from "@/app/component/recipe.form.modal";

interface RecipeCardProps {
    recipe: Recipe;
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
        <div className={"flex flex-col gap-1 bg-gray-300"}>
            <div>{title}</div>
            {children && Children.count(children)> 0 &&
                children
            }
            {
                !children || Children.count(children) === 0 &&
                <div>No {title}</div>
            }
        </div>
    )
}


const RecipeCard = forwardRef<RecipeCardHandle, RecipeCardProps>((props: RecipeCardProps, _ref) => {
    const recipe = props.recipe!;
    const modalRef = useRef<RecipeFormModalHandle>(null);
    const [editType, setEditType] = useState("Edit");

    return (
        <div className={"flex flex-col gap-2"}>
            <RecipeFormModal recipe={recipe} ref={modalRef} editType={editType}/>
            <div className={"flex flex-row justify-between"}>
                {recipe.name}
                <button onClick={() => {
                    setEditType("Edit")
                    modalRef.current!.toggle()
                }}>
                    <PencilIcon className={"size-6"}/>
                </button>
                <button onClick={() => {
                    setEditType("Fork")
                    modalRef.current!.toggle()
                }}>
                    <ArrowRightStartOnRectangleIcon className={"size-6"}/>
                </button>
            </div>
            <ListItems title={"Ingredients"}>
                {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex flex-row justify-between">
                        <div>{ingredient.name}</div>
                        <div className="flex flex-row gap-1">
                            <div>{ingredient.amount}</div>
                            <div>{ingredient.unit}</div>
                        </div>

                    </div>
                ))}

            </ListItems>
            <ListItems title={"Directions"}>
                {recipe.directions.map((direction) => (
                    <div key={direction.id}>
                        {direction.content}
                    </div>
                ))}

            </ListItems>
        </div>
    )
});

RecipeCard.displayName = "RecipeNodeCard";

export default RecipeCard;
