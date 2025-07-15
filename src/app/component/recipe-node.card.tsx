import {RecipeNode} from "@/app/model/recipe-node";
import {forwardRef, useImperativeHandle} from "react";

interface RecipeNodeProps {
  node: RecipeNode;
}

interface ListItemsProps {
  title: string;
  items: string[];
}

export interface RecipeNodeCardHandles {
  logFromRecipeNodeCard: () => void
}

const ListItems = (props: ListItemsProps) => {
  const items = props.items;
  const title = props.title;
  return (
    <div className={"flex flex-col gap-1 bg-gray-300"}>
      <div>{title}</div>
      { items && items.length > 0 &&
        items.map((item, index) => {
          return (
            <div key={index}>{item}</div>
          )
        })
      }
      {
        !items || items.length === 0 &&
          <div>No {title}</div>
      }
    </div>
  )
}



const RecipeNodeCard = forwardRef<RecipeNodeCardHandles, RecipeNodeProps>((props: RecipeNodeProps, ref) => {
  const recipeNode = props.node!;

  useImperativeHandle(ref, () => ({
    logFromRecipeNodeCard() {
      console.log("hello from logFromRecipeNodeCard");
    }
  }))
  return (
    <div className={"flex flex-col gap-2"}>
      <div>{recipeNode.name}</div>
      <ListItems title={"Ingredients"} items={recipeNode.ingredients}/>
      <ListItems title={"Directions"} items={recipeNode.directions}/>
    </div>
  )
});

RecipeNodeCard.displayName = "RecipeNodeCard";

export default RecipeNodeCard;