'use client'
import RecipeNodeCard, {RecipeNodeCardHandles} from "@/app/component/recipe-node.card";
import {RecipeNode} from "@/app/model/recipe-node";
import {useRef} from "react";
import RecipeList, {RecipeListHandles} from "@/app/component/recipe.list";


export default function Home() {
  const recipeListRef = useRef<RecipeListHandles>(null);
  return (
    <>
      <button onClick={() => {
        recipeListRef!.current!.refresh()
      }}>Refresh</button>
      <div className={"flex flex-row w-full bg-gray-200"}>
        <RecipeList className={"w-xs"} ref={recipeListRef}/>
        <RecipeNodeCard node={new RecipeNode("asdf", null, "Pizza",
          ["Flour", "Water", "Salt", "Yeast"],
          ["Mix it all up", "Bake it"]
        )}/>
      </div>
    </>
  );
}
