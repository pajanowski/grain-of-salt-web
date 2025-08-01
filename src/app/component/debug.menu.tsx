import {RecipeService} from "@/app/service/recipe.service";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";
import {useRef} from "react";
import RecipeFormModal, {RecipeFormModalHandle} from "@/app/component/recipe.form.modal";

const DebugMenu = () => {
    const recipeFormModal = useRef<RecipeFormModalHandle>(null);

    return (
        <div className="flex flex-row gap-4">
            <button onClick={() => {
                RecipeService.saveRecipeNode(NEAPOLITAN);
                RecipeService.saveRecipeNode(NY_STYLE);
                RecipeService.saveRecipeNode(PAPA_JOHNS);
                RecipeService.saveRecipeNode(NEW_HAVEN_STYLE);
            }}>Load data</button>
            <button onClick={() => {RecipeService.deleteAll()}}>Delete All</button>
            <button onClick={() => {recipeFormModal.current!.toggle()}}> Add New Recipe</button>
            <RecipeFormModal ref={recipeFormModal} editType={"Add"}/>
        </div>

    )
}

export default DebugMenu;
