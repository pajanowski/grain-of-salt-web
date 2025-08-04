/**
 * Tests for the RecipeFormV2 component when editing an existing recipe.
 *
 * These tests focus on the functionality of editing an existing recipe (form type is 'Edit').
 * The main requirements are:
 * 1. Editing an ingredient or direction should result in a remove change followed by an add change
 * 2. Removing a change that was already on the recipe should result in a remove change
 * 3. Removing a change that was added during editing should just remove that change
 */
import {describe, test, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor} from '@testing-library/react';
import RecipeFormV2 from '@/app/component/form/recipe.form.v2';
import {RecipeFormHandle} from '@/app/component/form/recipe.form';
import {RecipeService} from '@/app/service/recipe.service';
import {RecipeNode} from '@/app/model/recipe-node';
import {ChangeType} from '@/app/model/change';
import {Recipe} from '@/app/model/recipe';

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

describe('RecipeFormV2 - Edit Mode', () => {
    // Create a mock recipe with existing ingredients and directions
    const mockIngredient1 = { id: 'ing-1', name: 'Flour', unit: 'g', amount: 500 };
    const mockIngredient2 = { id: 'ing-2', name: 'Water', unit: 'ml', amount: 300 };
    const mockDirection1 = { id: 'dir-1', content: 'Mix ingredients' };
    const mockDirection2 = { id: 'dir-2', content: 'Bake for 30 minutes' };

    const mockRecipe = new Recipe(
        'recipe-1',
        'parent-1',
        'Test Recipe',
        [mockIngredient1, mockIngredient2],
        [mockDirection1, mockDirection2]
    );

    beforeEach(() => {
        // Reset the uuid counter before each test
        uuidCounter = 0;
        // Clear all mocks
        vi.clearAllMocks();
    });

    /**
     * Test that editing an ingredient results in a remove change followed by an add change.
     *
     * This test verifies that:
     * - The form loads with the existing ingredients
     * - Editing an ingredient creates a remove change for the original ingredient
     * - Editing an ingredient creates an add change for the new version
     */
    test('editing an ingredient results in a remove change followed by an add change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Verify the recipe name is loaded
        const nameInput = container.querySelector('[data-testid="recipe-name-input"]') as HTMLInputElement;
        expect(nameInput.value).toBe('Test Recipe');

        // Verify the ingredients are loaded
        const ingredientRows = container.querySelectorAll('[data-testid^="ingredient-content-"]');
        expect(ingredientRows.length).toBe(2);
        expect(ingredientRows[0].textContent).toContain('Flour');
        expect(ingredientRows[1].textContent).toContain('Water');

        // Edit the first ingredient
        // Click on the first ingredient row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="ingredient-row-0-container"]')!);

        // Find and click the edit button
        const editButton = container.querySelector('[data-testid="ingredient-row-0-edit-button"]');
        expect(editButton).toBeTruthy();
        fireEvent.click(editButton!);

        // Verify the ingredient form is displayed with the existing values
        const ingredientNameInput = container.querySelector('[data-testid="ingredient-name-input-1"]') as HTMLInputElement;
        const ingredientAmountInput = container.querySelector('[data-testid="ingredient-amount-input-1"]') as HTMLInputElement;
        const ingredientUnitInput = container.querySelector('[data-testid="ingredient-unit-input-1"]') as HTMLInputElement;

        expect(ingredientNameInput).toBeTruthy();
        expect(ingredientNameInput.value).toBe('Flour');
        expect(ingredientAmountInput.value).toBe('500');
        expect(ingredientUnitInput.value).toBe('g');

        // Change the ingredient values
        fireEvent.change(ingredientNameInput, {target: {value: 'Whole Wheat Flour'}});
        fireEvent.change(ingredientAmountInput, {target: {value: '400'}});
        fireEvent.change(ingredientUnitInput, {target: {value: 'g'}});

        // Find and click the confirm button
        const confirmButton = container.querySelector('[data-testid="ingredient-confirm-button-1"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();
        fireEvent.click(confirmButton);

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify the recipe node has the correct data
        expect(updatedRecipeNode.name).toBe('Test Recipe');

        // Verify that the ingredients list contains a remove change followed by an add change
        expect(updatedRecipeNode.ingredients.items.length).toBe(2);

        // The first change should be a remove change for the original ingredient
        expect(updatedRecipeNode.ingredients.items[0].changeType).toBe('Remove' as ChangeType);
        expect(updatedRecipeNode.ingredients.items[0].content?.name).toBe('Flour');
        expect(updatedRecipeNode.ingredients.items[0].content?.amount).toBe(500);
        expect(updatedRecipeNode.ingredients.items[0].content?.unit).toBe('g');

        // The second change should be an add change for the new ingredient
        expect(updatedRecipeNode.ingredients.items[1].changeType).toBe('Add' as ChangeType);
        expect(updatedRecipeNode.ingredients.items[1].content?.name).toBe('Whole Wheat Flour');
        expect(updatedRecipeNode.ingredients.items[1].content?.amount).toBe(400);
        expect(updatedRecipeNode.ingredients.items[1].content?.unit).toBe('g');
    });

    /**
     * Test that editing a direction results in a remove change followed by an add change.
     *
     * This test verifies that:
     * - The form loads with the existing directions
     * - Editing a direction creates a remove change for the original direction
     * - Editing a direction creates an add change for the new version
     */
    test('editing a direction results in a remove change followed by an add change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Verify the directions are loaded
        const directionRows = container.querySelectorAll('[data-testid^="direction-content-"]');
        expect(directionRows.length).toBe(2);
        expect(directionRows[0].textContent).toContain('Mix ingredients');
        expect(directionRows[1].textContent).toContain('Bake for 30 minutes');

        // Edit the first direction
        // Click on the first direction row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="direction-row-0-container"]')!);

        // Find and click the edit button
        const editButton = container.querySelector('[data-testid="direction-row-0-edit-button"]');
        expect(editButton).toBeTruthy();
        fireEvent.click(editButton!);

        // Verify the direction form is displayed with the existing values
        const directionInput = container.querySelector('[data-testid="direction-input-1"]') as HTMLInputElement;

        expect(directionInput).toBeTruthy();
        expect(directionInput.value).toBe('Mix ingredients');

        // Change the direction value
        fireEvent.change(directionInput, {target: {value: 'Mix ingredients thoroughly'}});

        // Find and click the confirm button
        const confirmButton = container.querySelector('[data-testid="direction-confirm-button-1"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();
        fireEvent.click(confirmButton);

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify that the directions list contains a remove change followed by an add change
        expect(updatedRecipeNode.directions.items.length).toBe(2);

        // The first change should be a remove change for the original direction
        expect(updatedRecipeNode.directions.items[0].changeType).toBe('Remove' as ChangeType);
        expect(updatedRecipeNode.directions.items[0].content?.content).toBe('Mix ingredients');

        // The second change should be an add change for the new direction
        expect(updatedRecipeNode.directions.items[1].changeType).toBe('Add' as ChangeType);
        expect(updatedRecipeNode.directions.items[1].content?.content).toBe('Mix ingredients thoroughly');
    });

    /**
     * Test that removing an ingredient that was already on the recipe results in a remove change.
     *
     * This test verifies that:
     * - The form loads with the existing ingredients
     * - Removing an ingredient creates a remove change
     */
    test('removing an ingredient that was already on the recipe results in a remove change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Verify the ingredients are loaded
        const ingredientRows = container.querySelectorAll('[data-testid^="ingredient-content-"]');
        expect(ingredientRows.length).toBe(2);

        // Remove the first ingredient
        // Click on the first ingredient row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="ingredient-row-0-container"]')!);

        // Find and click the remove button
        const removeButton = container.querySelector('[data-testid="ingredient-row-0-remove-button"]');
        expect(removeButton).toBeTruthy();
        fireEvent.click(removeButton!);

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify that the ingredients list contains a remove change
        expect(updatedRecipeNode.ingredients.items.length).toBe(1);
        expect(updatedRecipeNode.ingredients.items[0].changeType).toBe('Remove' as ChangeType);
        expect(updatedRecipeNode.ingredients.items[0].content?.name).toBe('Flour');
    });

    /**
     * Test that removing a direction that was already on the recipe results in a remove change.
     *
     * This test verifies that:
     * - The form loads with the existing directions
     * - Removing a direction creates a remove change
     */
    test('removing a direction that was already on the recipe results in a remove change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Verify the directions are loaded
        const directionRows = container.querySelectorAll('[data-testid^="direction-content-"]');
        expect(directionRows.length).toBe(2);

        // Remove the first direction
        // Click on the first direction row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="direction-row-0-container"]')!);

        // Find and click the remove button
        const removeButton = container.querySelector('[data-testid="direction-row-0-remove-button"]');
        expect(removeButton).toBeTruthy();
        fireEvent.click(removeButton!);

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify that the directions list contains a remove change
        expect(updatedRecipeNode.directions.items.length).toBe(1);
        expect(updatedRecipeNode.directions.items[0].changeType).toBe('Remove' as ChangeType);
        expect(updatedRecipeNode.directions.items[0].content?.content).toBe('Mix ingredients');
    });

    /**
     * Test that removing an ingredient that was added during editing just removes the change.
     *
     * This test verifies that:
     * - Adding a new ingredient during editing creates an add change
     * - Removing that newly added ingredient just removes the change from the list
     */
    test('removing an ingredient that was added during editing just removes the change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Add a new ingredient
        // Click on the ingredients container to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="ingredients-add-first-container"]')!);

        // Find and click the add button
        const addButton = container.querySelector('[data-testid="ingredients-add-first-add-button"]');
        expect(addButton).toBeTruthy();
        fireEvent.click(addButton!);

        // Fill in the ingredient form
        const ingredientNameInput = container.querySelector('[data-testid="ingredient-name-input-0"]') as HTMLInputElement;
        const ingredientAmountInput = container.querySelector('[data-testid="ingredient-amount-input-0"]') as HTMLInputElement;
        const ingredientUnitInput = container.querySelector('[data-testid="ingredient-unit-input-0"]') as HTMLInputElement;

        expect(ingredientNameInput).toBeTruthy();

        fireEvent.change(ingredientNameInput, {target: {value: 'Sugar'}});
        fireEvent.change(ingredientAmountInput, {target: {value: '100'}});
        fireEvent.change(ingredientUnitInput, {target: {value: 'g'}});

        // Find and click the confirm button
        const confirmButton = container.querySelector('[data-testid="ingredient-confirm-button-0"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();
        fireEvent.click(confirmButton);

        // Verify the new ingredient was added
        await waitFor(() => {
            const ingredientRows = container.querySelectorAll('[data-testid^="ingredient-content-"]');
            expect(ingredientRows.length).toBe(3);
            expect(ingredientRows[0].textContent).toContain('Sugar');
        });

        // Remove the newly added ingredient
        // Click on the first ingredient row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="ingredient-row-0-container"]')!);

        // Find and click the remove button
        const removeButton = container.querySelector('[data-testid="ingredient-row-0-remove-button"]');
        expect(removeButton).toBeTruthy();
        fireEvent.click(removeButton!);

        // Verify the ingredient was removed
        await waitFor(() => {
            const ingredientRows = container.querySelectorAll('[data-testid^="ingredient-content-"]');
            expect(ingredientRows.length).toBe(2);
            expect(ingredientRows[0].textContent).toContain('Flour');
        });

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify that the ingredients list doesn't contain any changes for the added and removed ingredient
        expect(updatedRecipeNode.ingredients.items.length).toBe(0);
    });

    /**
     * Test that removing a direction that was added during editing just removes the change.
     *
     * This test verifies that:
     * - Adding a new direction during editing creates an add change
     * - Removing that newly added direction just removes the change from the list
     */
    test('removing a direction that was added during editing just removes the change', async () => {
        const ref = {current: null as RecipeFormHandle | null};
        const {container} = render(<RecipeFormV2 ref={ref} editType="Fork" recipe={mockRecipe} />);

        // Set up a spy on RecipeService.saveRecipeNode
        const saveRecipeNodeSpy = vi.spyOn(RecipeService, 'saveRecipeNode').mockResolvedValue("");

        // Add a new direction
        // Click on the directions container to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="directions-add-first-container"]')!);

        // Find and click the add button
        const addButton = container.querySelector('[data-testid="directions-add-first-add-button"]');
        expect(addButton).toBeTruthy();
        fireEvent.click(addButton!);

        // Fill in the direction form
        const directionInput = container.querySelector('[data-testid="direction-input-0"]') as HTMLInputElement;

        expect(directionInput).toBeTruthy();

        fireEvent.change(directionInput, {target: {value: 'Let cool for 10 minutes'}});

        // Find and click the confirm button
        const confirmButton = container.querySelector('[data-testid="direction-confirm-button-0"]') as HTMLButtonElement;
        expect(confirmButton).toBeTruthy();
        fireEvent.click(confirmButton);

        // Verify the new direction was added
        await waitFor(() => {
            const directionRows = container.querySelectorAll('[data-testid^="direction-content-"]');
            expect(directionRows.length).toBe(3);
            expect(directionRows[0].textContent).toContain('Let cool for 10 minutes');
        });

        // Remove the newly added direction
        // Click on the first direction row to make the buttons visible
        fireEvent.mouseEnter(container.querySelector('[data-testid="direction-row-0-container"]')!);

        // Find and click the remove button
        const removeButton = container.querySelector('[data-testid="direction-row-0-remove-button"]');
        expect(removeButton).toBeTruthy();
        fireEvent.click(removeButton!);

        // Verify the direction was removed
        await waitFor(() => {
            const directionRows = container.querySelectorAll('[data-testid^="direction-content-"]');
            expect(directionRows.length).toBe(2);
            expect(directionRows[0].textContent).toContain('Mix ingredients');
        });

        // Submit the recipe node
        await ref.current?.submitRecipeNode();

        // Verify that saveRecipeNode was called
        expect(saveRecipeNodeSpy).toHaveBeenCalled();

        // Get the recipe node that was passed to saveRecipeNode
        const updatedRecipeNode = saveRecipeNodeSpy.mock.calls[0][0] as RecipeNode;

        // Verify that the directions list doesn't contain any changes for the added and removed direction
        expect(updatedRecipeNode.directions.items.length).toBe(0);
    });
});
