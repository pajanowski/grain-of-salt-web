'use client'
import RecipeNodeCard, {RecipeNodeCardHandles} from "@/app/component/recipe-node.card";
import {RecipeNode} from "@/app/model/recipe-node";
import {useRef} from "react";


export default function Home() {
  const recipeNodeCardRef = useRef<RecipeNodeCardHandles>(null);
  return (
    <>
      <button onClick={recipeNodeCardRef!.current!.logFromRecipeNodeCard}>Click for log</button>
      <RecipeNodeCard ref={recipeNodeCardRef} node={new RecipeNode("asdf", "Pizza",
        ["Flour", "Water", "Salt", "Yeast"],
        ["Mix it all up", "Bake it"]
      )}/></>
  );
}
