'use client'

import {Suspense, useState } from 'react';
import { RecipeNode } from '@/app/model/recipe-node';
import Link from 'next/link';
import RecipeTreeViewBySearchParam from "@/app/component/search-param.recipe.tree";

export default function RecipeTreePage() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeNode | undefined>(undefined);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Recipe Hierarchy Visualization</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Suspense fallback={null}>
                <RecipeTreeViewBySearchParam/>
            </Suspense>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Selected Recipe</h2>
          {selectedRecipe ? (
            <div>
              <h3 className="text-lg font-medium">{selectedRecipe.name}</h3>
              <p className="text-gray-600 mt-2">ID: {selectedRecipe.id}</p>
              <p className="text-gray-600">Parent ID: {selectedRecipe.parentId}</p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/recipe/${selectedRecipe.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center"
                >
                  View Recipe
                </Link>

                <Link
                  href={`/recipe-tree?rootId=${selectedRecipe.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center sm:ml-auto"
                >
                  Focus Tree
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No recipe selected. Click on a recipe in the tree to view details.</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About This Visualization</h2>
        <p className="text-gray-700">
          This tree visualization shows the hierarchical relationships between recipes.
          Each recipe can be forked from another recipe, creating a parent-child relationship.
          Click on the arrow icons to expand or collapse branches of the tree.
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>Root recipes are shown at the top level</li>
          <li>Child recipes (forks) are nested under their parent recipes</li>
          <li>Click on a recipe name to select it and view details</li>
          <li>Use the &quot;Focus Tree&quot; button to view a subtree starting from the selected recipe</li>
        </ul>
      </div>
    </div>
  );
}
