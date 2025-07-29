import {RecipeService} from "@/app/service/recipe.service";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";
import RecipeForm, {RecipeFormHandle} from "@/app/component/form/recipe.form";
import {useRef, useState} from "react";
import {ModalDialog} from "@/app/component/modal.dialog";
import RecipeFormV2 from "@/app/component/form/recipe.form.v2";

const DebugMenu = () => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const recipeFormRef = useRef<RecipeFormHandle>(null);
    return (
        <div className="flex flex-row gap-4">
            <button onClick={() => {
                RecipeService.saveRecipeNode(NEAPOLITAN);
                RecipeService.saveRecipeNode(NY_STYLE);
                RecipeService.saveRecipeNode(PAPA_JOHNS);
                RecipeService.saveRecipeNode(NEW_HAVEN_STYLE);
            }}>Load data</button>
            <button onClick={() => {RecipeService.deleteAll()}}>Delete All</button>
            <button onClick={toggleModal}>Add New Recipe</button>
            {showModal && (
                <ModalDialog onClose={toggleModal} onConfirm={() => {
                    recipeFormRef.current!.submitRecipeNode()
                }}>
                    <RecipeFormV2 ref={recipeFormRef}/>
                </ModalDialog>
            )}
        </div>

    )
}

export default DebugMenu;
