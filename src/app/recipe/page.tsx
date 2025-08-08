'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Recipe } from '@/app/model/recipe';
import {NONE_PARENT_ID, RecipeNode} from '@/app/model/recipe-node';
import { RecipeService } from '@/app/service/recipe.service';
import RecipeCard from '@/app/component/recipe.card';
import RecipeTreeView from '@/app/component/recipe.tree.view';
import Link from 'next/link';

export default function RecipePage() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id');
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [recipeNode, setRecipeNode] = useState<RecipeNode | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);

        // Fetch the recipe data
        const recipeData = await RecipeService.getRecipeFromNodeId(recipeId!);
        setRecipe(recipeData);

        // Fetch the recipe node data for the tree view
        const nodeData = await RecipeService.getRecipeNodeFromId(recipeId!);
        setRecipeNode(nodeData);

        setError(null);
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('Failed to load recipe. The recipe may not exist.');
      } finally {
        setLoading(false);
      }
    }

    if (recipeId) {
      loadRecipe();
    } else {
      setError('No recipe ID provided');
      setLoading(false);
    }
  }, [recipeId]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading recipe...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <RecipeCard recipe={recipe} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {recipeNode && (
              <RecipeTreeView
                rootRecipeId={recipeNode.parentId != NONE_PARENT_ID ? recipeNode.parentId : recipeNode.id}
                selectedRecipeId={recipeNode.id}
                showParentOfSelected={true}
                className="max-h-[500px] overflow-auto"
              />
            )}
            <div className="mt-4">
              <Link
                href={`/recipe-tree?rootId=${recipeId}`}
                className="text-blue-500 hover:underline"
              >
                View full tree visualization
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
