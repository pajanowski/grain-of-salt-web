// lets see where this goes
// in previous attempts, tracking changes with just arrays was horrible
// I think having a concrete list with methods for pushing back
// pushing front, inserting, removing, replacing would be very helpful
// maybe i can have it implement iterable just for funzies / extraness
import {Add, Change, Remove, Replace} from "@/app/model/change";

export class ChangeList<T> {
    items: Change<T>[] = [];


    // create a change list of all noops for a list of items
    // used for going from recipe to recipe node
    constructor(items?: T[]) {
        this.items = items?.map((item, line) => {
            return new Change('Noop', item, line);
        }) ?? [];
    }

    add(content: T, line: number): this {
        const addBack = new Add<T>(content, line);
        this.items.push(addBack);
        return this;
    };

    replace(newContent: T, line: number): this {
        this.items.push(new Replace<T>(newContent, line))
        return this;
    };

    remove(line: number): this {
        this.items.push(new Remove<T>(line));
        return this;
    };
}

