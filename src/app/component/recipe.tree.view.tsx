import {useState, useEffect} from 'react';
import {RecipeNode} from '@/app/model/recipe-node';
import {RecipeService} from '@/app/service/recipe.service';
import Link from 'next/link';
import {ChevronDownIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import {useLiveQuery} from "dexie-react-hooks";

/**
 * RecipeTreeView Component
 *
 * A component that visualizes the recipe's tree hierarchy, showing parent-child relationships
 * between recipes. It displays a collapsible tree structure where users can expand/collapse
 * nodes to explore the recipe hierarchy.
 *
 * Features:
 * - Displays recipes in a hierarchical tree structure
 * - Allows expanding/collapsing of tree nodes
 * - Shows recipe names with links to view the full recipe
 * - Highlights the currently selected recipe
 *
 * @example
 * ```tsx
 * <RecipeTreeView
 *   rootRecipeId="recipe-123"
 *   selectedRecipeId="recipe-456"
 *   onSelectRecipe={(recipe) => console.log('Selected recipe:', recipe)}
 * />
 * ```
 */
interface RecipeTreeViewProps {
    /**
     * The ID of the root recipe to start the tree visualization from.
     * If not provided, all root recipes will be shown.
     */
    rootRecipeId: string;

    /**
     * The ID of the currently selected recipe (to highlight in the tree).
     */
    selectedRecipeId?: string;

    /**
     * Callback function that is called when a recipe is selected in the tree.
     * @param recipe The selected RecipeNode
     */
    onSelectRecipe?: (recipe: RecipeNode) => void;

    /**
     * Additional CSS classes to apply to the component's container.
     */
    className?: string;
}

/**
 * Props for the RecipeTreeNode component that renders individual nodes in the tree
 */
interface RecipeTreeNodeProps {
    recipe: RecipeNode;
    level: number;
    selectedRecipeId?: string;
    onSelectRecipe?: (recipe: RecipeNode) => void;
}

/**
 * RecipeTreeNode - Renders a single node in the recipe tree
 */
const RecipeTreeNode = ({
                            recipe,
                            level,
                            selectedRecipeId,
                            onSelectRecipe,
                        }: RecipeTreeNodeProps) => {
    const [children, setChildren] = useState<RecipeNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isSelected = recipe.id === selectedRecipeId;

    // Always load children on mount
    useEffect(() => {
        const loadChildren = async () => {
            setIsLoading(true);
            // Safely call getRecipeChildren and handle potential undefined return values
            const childNodes = await RecipeService.getRecipeChildren?.(recipe.id) || [];
            setChildren(childNodes)
        };

        loadChildren();
    }, [recipe.id]);

    const handleSelect = () => {
        if (onSelectRecipe) {
            onSelectRecipe(recipe);
        }
    };

    // Calculate left padding based on nesting level - more compact for better mobile experience
    const paddingLeft = `${level * 1}rem`;

    return (
        <div>
            <div
                className={`flex items-center py-2 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-100' : ''} pr-2`}
                style={{paddingLeft}}
            >
                {/* Node indicator */}
                <div className="mr-1 w-5 h-5 flex items-center justify-center">
                    {isLoading ? (
                        <div
                            className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                        children.length > 0 ?
                            <ChevronDownIcon className="w-4 h-4 text-gray-500"/> :
                            <div className="w-4 h-4 flex items-center justify-center">•</div>
                    )}
                </div>

                {/* Recipe name */}
                <div
                    onClick={handleSelect}
                    className="flex-grow font-medium"
                    data-testid="recipe-name"
                >
                    {recipe.name}
                </div>

                {/* Link to recipe page */}
                <Link
                    href={`/recipe?id=${recipe.id}`}
                    className="ml-2 text-blue-500 text-sm hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    View
                </Link>
            </div>

            {/* Children nodes (always visible) */}
            <div className="children-container">
                {children.length > 0 && (
                    children.map(child => (
                        <RecipeTreeNode
                            key={child.id}
                            recipe={child}
                            level={level + 1}
                            selectedRecipeId={selectedRecipeId}
                            onSelectRecipe={onSelectRecipe}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

/**
 * RecipeTreeView - Main component that displays the recipe hierarchy as a tree
 */
const RecipeTreeView = ({
                            rootRecipeId,
                            selectedRecipeId,
                            onSelectRecipe,
                            className = '',
                        }: RecipeTreeViewProps) => {
    const [rootRecipes, setRootRecipes] = useState<RecipeNode[]>([]);
    const [rootRecipesLoading, setRootRecipesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useLiveQuery(() => {
        const loadRootRecipes = async () => {
            setRootRecipesLoading(true);
            const rootRecipes = await RecipeService.getRootRecipes() || [];
            setRootRecipes(rootRecipes);
            setRootRecipesLoading(false);
        }
        loadRootRecipes();
    }, [rootRecipeId]);

    if (rootRecipesLoading) {
        return (
            <div className={`recipe-tree-loading ${className}`}>
                <div className="flex justify-center items-center p-4">
                    <div
                        className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                    <span>Loading recipe tree...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`recipe-tree-error ${className}`}>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (rootRecipes.length === 0) {
        return (
            <div className={`recipe-tree-empty ${className}`}>
                <p className="text-gray-500 p-4">No recipes found</p>
            </div>
        );
    }

    return (
        <div className={`recipe-tree-view ${className}`}>
            <h3 className="text-lg font-semibold mb-2">Recipe Hierarchy</h3>
            <div className="border rounded-md overflow-hidden">
                {rootRecipes.map(recipe => (
                    <RecipeTreeNode
                        key={recipe.id}
                        recipe={recipe}
                        level={0}
                        selectedRecipeId={selectedRecipeId}
                        onSelectRecipe={onSelectRecipe}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecipeTreeView;
