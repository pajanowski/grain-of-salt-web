import {RecipeService} from "@/app/service/recipe.service";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";
import {useRef} from "react";
import RecipeFormModal, {RecipeFormModalHandle} from "@/app/component/recipe.form.modal";
import {
    PHILLS_DUNKIN_COFFEE,
    PHILLS_FANCY_COFFEE,
    PHILLS_STANDARD_COFFEE,
    PHILLS_WORK_COFFEE
} from "@/app/static-data.coffee";

const DebugMenu = () => {
    const recipeFormModal = useRef<RecipeFormModalHandle>(null);

    return (
        <div className="flex flex-row gap-4">
            <button onClick={() => {
                RecipeService.saveRecipeNode(NEAPOLITAN);
                RecipeService.saveRecipeNode(NY_STYLE);
                RecipeService.saveRecipeNode(PAPA_JOHNS);
                RecipeService.saveRecipeNode(NEW_HAVEN_STYLE);
                RecipeService.saveRecipeNode(PHILLS_WORK_COFFEE);
                RecipeService.saveRecipeNode(PHILLS_DUNKIN_COFFEE);
                RecipeService.saveRecipeNode(PHILLS_FANCY_COFFEE);
                RecipeService.saveRecipeNode(PHILLS_STANDARD_COFFEE);
            }}>Load data</button>
            <button onClick={() => {RecipeService.deleteAll()}}>Delete All</button>
            <button onClick={() => {recipeFormModal.current!.toggle()}}> Add New Recipe</button>
            <RecipeFormModal ref={recipeFormModal} editType={"Add"}/>
        </div>

    )
}

export default DebugMenu;
