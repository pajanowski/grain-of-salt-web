export class Change<T> {
    changeType: ChangeType;
    content?: T
    line?: number;

    /**
     *
     * @param changeType 'Add', 'Remove', 'Replace', 'Noop'
     * @param content should only be undefined on 'Remove' changes
     * @param line line add which we are adding, removing, or replacing
     */
    constructor(changeType: ChangeType, content: T | undefined, line?: number) {
        this.changeType = changeType;
        this.content = content;
        this.line = line;
    }
}

export class Add<T> extends Change<T> {
    constructor(content: T, line?: number) {
        super('Add', content, line);
    }
}

export class Remove<T> extends Change<T> {
    constructor(line?: number) {
        super('Remove', undefined, line);
    }
}

export class Noop<T> extends Change<T> {
    constructor(content: T, line?: number) {
        super('Noop', content, line);
    }
}

export class Replace<T> extends Change<T> {
    constructor(newContent: T, line?: number) {
        super('Replace', newContent, line);
    }
}

/**
 * Add = Adding content
 * Remove = Removing content
 * Replace = Replacing content
 * Noop = Hopefully unused
 */
export const ChangeTypes = ['Add', 'Remove', 'Replace', 'Noop'];
export type ChangeType = typeof ChangeTypes[number];