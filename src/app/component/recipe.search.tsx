import {useLiveQuery} from "dexie-react-hooks";
import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {RecipeNode} from "@/app/model/recipe-node";
import {useState} from "react";
import {useRouter} from "next/navigation";

/**
 * RecipeSearch Component
 *
 * A component that allows users to search for recipes by name.
 * It displays a search input field and a list of matching recipes.
 *
 * Features:
 * - Real-time search as you type
 * - Displays recipe names in a list
 * - Clickable recipe items that trigger the onSelectRecipe callback
 * - Falls back to showing root recipes when search is empty
 *
 * @example
 * ```tsx
 * <RecipeSearch
 *   onSelectRecipe={(recipe) => console.log('Selected recipe:', recipe)}
 *   className="w-full"
 * />
 * ```
 */
interface RecipeSearchProps {
    /**
     * Callback function that is called when a recipe is selected from the search results.
     * @param recipe The selected RecipeNode
     */
    onSelectRecipe?: (recipe: RecipeNode) => void;

    /**
     * Additional CSS classes to apply to the component's container.
     */
    className?: string;
}

const RecipeSearch = (props: RecipeSearchProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const recipes = useLiveQuery(
        () => RecipeNodeStore.searchRecipesByName(searchTerm),
        [searchTerm]
    ) || [];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectRecipe = (recipe: RecipeNode) => {
        // Call the callback if provided (for backward compatibility)
        if (props.onSelectRecipe) {
            props.onSelectRecipe(recipe);
        }

        // Navigate to the recipe page
        router.push(`/recipe/${recipe.id}`);
    };

    return (
        <div className={`flex flex-col ${props.className || ''}`}>
            <div className="mb-4">
                <label htmlFor="recipe-search" className="block text-gray-700 text-sm font-bold mb-2">
                    Search Recipes
                </label>
                <input
                    id="recipe-search"
                    type="text"
                    placeholder="Search by recipe name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    data-testid="recipe-search-input"
                />
            </div>

            {searchTerm.length > 0 && (
                <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    {recipes.length === 0 ? (
                        <p className="text-gray-500">No recipes found</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {recipes.map((recipe) => (
                                <li
                                    key={recipe.id}
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectRecipe(recipe)}
                                    data-testid={`recipe-result-${recipe.id}`}
                                >
                                    <div className="font-medium">{recipe.name}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeSearch;
