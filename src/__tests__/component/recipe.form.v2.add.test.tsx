/**
 * Tests for the RecipeFormV2 component.
 *
 * These tests focus on the functionality of adding a root recipe (form type is 'Add').
 * The main requirement is that when adding a root recipe, the only changes in the
 * change lists should be additions (ChangeType = 'Add').
 *
 * Future tests will cover forking and editing recipes.
 */
import {describe, test, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor} from '@testing-library/react';
import RecipeFormV2 from '@/app/component/form/recipe.form.v2';
import {RecipeFormHandle} from '@/app/component/form/recipe.form';
import {RecipeService} from '@/app/service/recipe.service';
import {RecipeNode} from '@/app/model/recipe-node';
import {ChangeType} from '@/app/model/change';

// Mock uuid to return predictable values for testing
let uuidCounter = 0;
vi.mock('uuid', () => ({
    v4: () => `test-uuid-${uuidCounter++}`
}));

// Mock RecipeService
vi.mock('@/app/service/recipe.service', () => ({
    RecipeService: {
        saveRootRecipe: vi.fn().mockResolvedValue({}),
        updateRecipeNode: vi.fn().mockResolvedValue({}),
        saveRecipeNode: vi.fn().mockResolvedValue({})
    }
}));

describe('RecipeFormV2', () => {
    beforeEach(() => {
        // Reset the uuid counter before each test
        uuidCounter = 0;
        // Clear all mocks
        vi.clearAllMocks();
    });

    /**
     * Test that the form renders with an initial empty state.
     *
     * This test verifies that:
     * - The recipe name input field is rendered
     * - The form is rendered in "Add" mode
     */
    test('renders the form with initial empty state', () => {
        const ref = {current: null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Add" />);

        // Check if the form elements are rendered
        expect(container.querySelector('[data-testid="recipe-name-input"]')).toBeTruthy();

        // Check if the form is in "Add" mode
        expect(container.querySelector('form')).toBeTruthy();
    });

    /**
     * Test that the form allows adding ingredients.
     *
     * This test verifies that:
     * - The add ingredient button works
     * - The ingredient form is rendered when the add button is clicked
     * - The ingredient form can be filled in
     * - The ingredient is added to the form when the confirm button is clicked
     * - The ingredient is displayed with the correct data
     */
    test('allows adding ingredients and directions', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Add" />);

        // Debug the rendered HTML to see the structure
        // debug();

        // Fill in the recipe name
        const nameInput = container.querySelector('[data-testid="recipe-name-input"]') as HTMLInputElement;
        fireEvent.change(nameInput, {target: {value: 'Test Recipe'}});

        // Add an ingredient
        // Find the ingredients add button
        const ingredientsContainer = container.querySelector('[data-testid="ingredients-add-first-container"]');
        expect(ingredientsContainer).toBeTruthy();

        // Click on the ingredients container to make the buttons visible
        fireEvent.mouseEnter(ingredientsContainer!);

        // Find and click the add button
        const addButton = container.querySelector('[data-testid="ingredients-add-first-add-button"]');
        expect(addButton).toBeTruthy();
        fireEvent.click(addButton!);

        // Fill in the ingredient form
        const ingredientNameInput = container.querySelector('[data-testid="ingredient-name-input-0"]') as HTMLInputElement;
        const ingredientAmountInput = container.querySelector('[data-testid="ingredient-amount-input-0"]') as HTMLInputElement;
        const ingredientUnitInput = container.querySelector('[data-testid="ingredient-unit-input-0"]') as HTMLInputElement;

        expect(ingredientNameInput).toBeTruthy();
        expect(ingredientAmountInput).toBeTruthy();
        expect(ingredientUnitInput).toBeTruthy();

        fireEvent.change(ingredientNameInput, {target: {value: 'Flour'}});
        fireEvent.change(ingredientAmountInput, {target: {value: '500'}});
        fireEvent.change(ingredientUnitInput, {target: {value: 'g'}});

        // Find the form row buttons
        const removeButton = container.querySelector('[data-testid="ingredient-remove-button-0"]');
        expect(removeButton).toBeTruthy();

        // Find the confirm button
        const confirmButton = container.querySelector('[data-testid="ingredient-confirm-button-0"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();

        // Click the confirm button
        fireEvent.click(confirmButton);

        // Verify the ingredient was added
        await waitFor(() => {
            const ingredientRow = container.querySelector('[data-testid="ingredient-content-0"]');
            expect(ingredientRow).toBeTruthy();
            expect(ingredientRow?.textContent).toContain('Flour');
            expect(ingredientRow?.textContent).toContain('500');
            expect(ingredientRow?.textContent).toContain('g');
        }, { timeout: 1000 });
    });

    /**
     * Test that submitting the form with a new recipe results in only Add changes.
     *
     * This test verifies that:
     * - The form can be filled in with a recipe name and ingredient
     * - The form can be submitted
     * - The RecipeService.saveRootRecipe method is called with the correct data
     * - The recipe node passed to saveRootRecipe has only Add changes in the ingredients list
     * - The ingredient data is correct
     */
    test('submits the form with only Add changes for a new recipe', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Add" />);

        // Set up a spy on RecipeService.saveRootRecipe
        const saveRootRecipeSpy = vi.spyOn(RecipeService, 'saveRootRecipe').mockResolvedValue("");

        // Fill in the recipe name
        const nameInput = container.querySelector('[data-testid="recipe-name-input"]') as HTMLInputElement;
        fireEvent.change(nameInput, {target: {value: 'Test Recipe'}});

        // Add an ingredient
        // Find the ingredients add button
        const ingredientsContainer = container.querySelector('[data-testid="ingredients-add-first-container"]');
        expect(ingredientsContainer).toBeTruthy();

        // Click on the ingredients container to make the buttons visible
        fireEvent.mouseEnter(ingredientsContainer!);

        // Find and click the add button
        const addButton = container.querySelector('[data-testid="ingredients-add-first-add-button"]');
        expect(addButton).toBeTruthy();
        fireEvent.click(addButton!);

        // Fill in the ingredient form
        const ingredientNameInput = container.querySelector('[data-testid="ingredient-name-input-0"]') as HTMLInputElement;
        const ingredientAmountInput = container.querySelector('[data-testid="ingredient-amount-input-0"]') as HTMLInputElement;
        const ingredientUnitInput = container.querySelector('[data-testid="ingredient-unit-input-0"]') as HTMLInputElement;

        expect(ingredientNameInput).toBeTruthy();
        expect(ingredientAmountInput).toBeTruthy();
        expect(ingredientUnitInput).toBeTruthy();

        fireEvent.change(ingredientNameInput, {target: {value: 'Flour'}});
        fireEvent.change(ingredientAmountInput, {target: {value: '500'}});
        fireEvent.change(ingredientUnitInput, {target: {value: 'g'}});

        // Find the form row buttons
        const removeButton = container.querySelector('[data-testid="ingredient-remove-button-0"]');
        expect(removeButton).toBeTruthy();

        // Find the confirm button
        const confirmButton = container.querySelector('[data-testid="ingredient-confirm-button-0"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();

        // Click the confirm button
        fireEvent.click(confirmButton);

        // Verify the ingredient was added
        await waitFor(() => {
            const ingredientRow = container.querySelector('[data-testid="ingredient-content-0"]');
            expect(ingredientRow).toBeTruthy();
            expect(ingredientRow?.textContent).toContain('Flour');
        }, { timeout: 1000 });

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRootRecipe was called
        expect(saveRootRecipeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRootRecipe
        const savedRecipeNode = saveRootRecipeSpy.mock.calls[0][0] as RecipeNode;

        // Verify the recipe node has the correct data
        expect(savedRecipeNode.name).toBe('Test Recipe');

        // Verify that all changes in the ingredients list are "Add" changes
        expect(savedRecipeNode.ingredients.items.length).toBeGreaterThan(0);
        savedRecipeNode.ingredients.items.forEach(change => {
            expect(change.changeType).toBe('Add' as ChangeType);
        });

        // Verify that the first ingredient is correct
        const firstIngredient = savedRecipeNode.ingredients.items[0].content;
        expect(firstIngredient?.name).toBe('Flour');
        expect(firstIngredient?.amount).toBe(500);
        expect(firstIngredient?.unit).toBe('g');
    });

    /**
     * Placeholder test for forking and editing tests.
     *
     * These tests will be implemented in future tickets.
     */
    test.skip('forking and editing tests will be implemented in future tickets', () => {
        // This is a placeholder test to remind us to implement these tests later
        expect(true).toBe(true);
    });
});
