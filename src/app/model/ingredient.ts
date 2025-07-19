import {v4 as uuid} from 'uuid';

export class Ingredient {
    id: string
    name: string;
    unit: string;
    amount: number;

    constructor(name: string, unit: string, amount: number) {
        this.id = uuid();
        this.name = name;
        this.unit = unit;
        this.amount = amount;
    }
}