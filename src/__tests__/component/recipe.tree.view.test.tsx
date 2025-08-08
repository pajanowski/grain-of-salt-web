import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RecipeTreeView from '@/app/component/recipe.tree.view';
import { RecipeService } from '@/app/service/recipe.service';
import { RecipeNode } from '@/app/model/recipe-node';
import { ChangeList } from '@/app/model/change.list';

// Mock the RecipeService
vi.mock('@/app/service/recipe.service', () => ({
  RecipeService: {
    getRootRecipes: vi.fn().mockResolvedValue([]),
    getRecipeNodeFromId: vi.fn().mockResolvedValue(undefined),
    getRecipeChildren: vi.fn().mockResolvedValue([])
  }
}));

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useSearchParams: () => ({
    get: vi.fn()
  })
}));

describe('RecipeTreeView Component', () => {
  // Create mock recipe nodes for testing
  const mockRootRecipe = new RecipeNode('root-1', 'none', 'Root Recipe', new ChangeList(), new ChangeList());
  const mockChildRecipe1 = new RecipeNode('child-1', 'root-1', 'Child Recipe 1', new ChangeList(), new ChangeList());
  const mockChildRecipe2 = new RecipeNode('child-2', 'root-1', 'Child Recipe 2', new ChangeList(), new ChangeList());
  const mockGrandchildRecipe = new RecipeNode('grandchild-1', 'child-1', 'Grandchild Recipe', new ChangeList(), new ChangeList());

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations
    vi.mocked(RecipeService.getRootRecipes).mockResolvedValue([mockRootRecipe]);
    vi.mocked(RecipeService.getRecipeNodeFromId).mockImplementation(async (id) => {
      if (id === 'root-1') return mockRootRecipe;
      if (id === 'child-1') return mockChildRecipe1;
      if (id === 'child-2') return mockChildRecipe2;
      if (id === 'grandchild-1') return mockGrandchildRecipe;
      return undefined;
    });
    vi.mocked(RecipeService.getRecipeChildren).mockImplementation(async (id) => {
      if (id === 'root-1') return [mockChildRecipe1, mockChildRecipe2];
      if (id === 'child-1') return [mockGrandchildRecipe];
      return [];
    });
  });

  test('renders loading state initially', () => {
    const { getByText } = render(<RecipeTreeView />);
    expect(getByText('Loading recipe tree...')).toBeTruthy();
  });

  test('renders root recipes when loaded', async () => {
    const { getByText } = render(<RecipeTreeView />);

    await waitFor(() => {
      expect(getByText('Recipe Hierarchy')).toBeTruthy();
      expect(getByText('Root Recipe')).toBeTruthy();
    });
  });

  test('automatically displays all child nodes', async () => {
    const { getByText, getAllByText } = render(<RecipeTreeView />);

    // Wait for the component to load and verify that all nodes are visible
    await waitFor(() => {
      // Root node should be visible
      expect(getAllByText('Root Recipe').length).toBeGreaterThan(0);

      // Child nodes should be automatically visible without clicking
      expect(getAllByText('Child Recipe 1').length).toBeGreaterThan(0);
      expect(getAllByText('Child Recipe 2').length).toBeGreaterThan(0);

      // Even grandchild nodes should be visible
      expect(getAllByText('Grandchild Recipe').length).toBeGreaterThan(0);
    });
  });

  test.skip('calls onSelectRecipe when a recipe is clicked', async () => {
    const onSelectRecipeMock = vi.fn();
    const { getAllByText, getAllByTestId } = render(
      <RecipeTreeView onSelectRecipe={onSelectRecipeMock} />
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(getAllByText('Root Recipe').length).toBeGreaterThan(0);
      expect(getAllByTestId('recipe-name').length).toBeGreaterThan(0);
    });

    // Find the first recipe name element with the data-testid
    const recipeNameElements = getAllByTestId('recipe-name');

    // Click on the first recipe name element
    fireEvent.click(recipeNameElements[0]);

    // Verify the callback was called with the correct recipe
    expect(onSelectRecipeMock).toHaveBeenCalledWith(mockRootRecipe);
  });

  test('renders a specific recipe tree when rootRecipeId is provided', async () => {
    vi.mocked(RecipeService.getRecipeNodeFromId).mockResolvedValue(mockChildRecipe1);

    const { getAllByText } = render(<RecipeTreeView rootRecipeId="child-1" />);

    // Wait for the component to load
    await waitFor(() => {
      expect(getAllByText('Child Recipe 1').length).toBeGreaterThan(0);
    });
  });

  test('highlights the selected recipe when selectedRecipeId is provided', async () => {
    const { getAllByTestId } = render(
      <RecipeTreeView selectedRecipeId="root-1" />
    );

    // Wait for the component to load
    await waitFor(() => {
      // Get all recipe name elements
      const recipeNameElements = getAllByTestId('recipe-name');
      expect(recipeNameElements.length).toBeGreaterThan(0);

      // Find the parent container of the recipe name elements
      const recipeContainers = recipeNameElements.map(el => el.closest('div')?.parentElement);

      // Check if any of the containers has the bg-blue-100 class
      const highlightedContainer = recipeContainers.find(container =>
        container?.className.includes('bg-blue-100')
      );
      expect(highlightedContainer).toBeTruthy();
    });
  });
});
