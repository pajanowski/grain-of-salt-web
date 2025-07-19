import {v4 as uuid} from 'uuid';

export class Direction {
    id: string;
    content: string;

    constructor(content: string) {
        this.id = uuid();
        this.content = content;
    }
}