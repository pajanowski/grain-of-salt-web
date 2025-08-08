import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RecipeSearch from '@/app/component/recipe.search';
import { RecipeNodeStore } from '@/app/dao/recipe-node.store';
import { RecipeNode } from '@/app/model/recipe-node';
import { ChangeList } from '@/app/model/change.list';

// Mock the RecipeNodeStore
vi.mock('@/app/dao/recipe-node.store', () => ({
  RecipeNodeStore: {
    searchRecipesByName: vi.fn()
  }
}));

// Mock the useLiveQuery hook
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: (queryFn: () => Promise<RecipeNode[]>) => {
    queryFn(); // Execute the query function to trigger the mock
    return mockRecipes; // Return the mock data
  }
}));

// Mock recipe data
const mockRecipes = [
  new RecipeNode('recipe-1', 'parent-1', 'Chocolate Cake', new ChangeList(), new ChangeList()),
  new RecipeNode('recipe-2', 'parent-2', 'Vanilla Cupcakes', new ChangeList(), new ChangeList()),
  new RecipeNode('recipe-3', 'parent-3', 'Strawberry Pie', new ChangeList(), new ChangeList())
];

describe('RecipeSearch Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up the mock to return our test data
    vi.mocked(RecipeNodeStore.searchRecipesByName).mockResolvedValue(mockRecipes);
  });

  test('renders the search input', () => {
    const { getByTestId } = render(<RecipeSearch />);
    const searchInput = getByTestId('recipe-search-input');
    expect(searchInput).toBeTruthy();
  });

  test('displays search results', async () => {
    const { getByText } = render(<RecipeSearch />);

    // Wait for the results to be displayed
    await waitFor(() => {
      expect(getByText('Chocolate Cake')).toBeTruthy();
      expect(getByText('Vanilla Cupcakes')).toBeTruthy();
      expect(getByText('Strawberry Pie')).toBeTruthy();
    });
  });

  test('calls searchRecipesByName with the correct search term', async () => {
    const { getByTestId } = render(<RecipeSearch />);
    const searchInput = getByTestId('recipe-search-input');

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });

    // Verify the search function was called with the correct term
    await waitFor(() => {
      expect(RecipeNodeStore.searchRecipesByName).toHaveBeenCalledWith('chocolate');
    });
  });

  test('calls onSelectRecipe when a recipe is clicked', async () => {
    const onSelectRecipeMock = vi.fn();
    const { getByText } = render(<RecipeSearch onSelectRecipe={onSelectRecipeMock} />);

    // Wait for the results to be displayed
    await waitFor(() => {
      const recipeItem = getByText('Chocolate Cake');
      expect(recipeItem).toBeTruthy();

      // Click on a recipe
      fireEvent.click(recipeItem);

      // Verify the callback was called with the correct recipe
      expect(onSelectRecipeMock).toHaveBeenCalledWith(mockRecipes[0]);
    });
  });
});
