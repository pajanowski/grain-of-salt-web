import {ModalDialog} from "@/app/component/modal.dialog";
import RecipeFormV2 from "@/app/component/form/recipe.form.v2";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {RecipeFormHandle} from "@/app/component/form/recipe.form";
import {Recipe} from "@/app/model/recipe";

export interface RecipeFormModalHandle {
   toggle: () => void;
}

interface RecipeFormModalProps {
    recipe?: Recipe;
}

const RecipeFormModal = forwardRef<RecipeFormModalHandle, RecipeFormModalProps>((props, ref) => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const recipeFormRef = useRef<RecipeFormHandle>(null);

    useImperativeHandle(ref, () => {
        return {
            toggle(): void {
                console.log("toggled")
                toggleModal();
            }
        }
    });

    return (
        <div>
            {showModal &&
            <ModalDialog onClose={toggleModal} onConfirm={() => {
                recipeFormRef.current!.submitRecipeNode();
                toggleModal();
            }}>
                <RecipeFormV2 ref={recipeFormRef} recipe={props.recipe}/>
            </ModalDialog>
            }
        </div>
    )
});

RecipeFormModal.displayName = "RecipeFormModal";

export default RecipeFormModal;
