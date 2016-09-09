declare namespace dragula {
    
    export interface DragulaOptions {
        isContainer?: (el?: Element) => boolean;       
        moves?: (el?: Element, source?: Element, handle?: Element, sibling?: Element) => boolean;
        accepts?: (el?: Element, target?: Element, source?: Element, sibling?: Element) => boolean;
        invalid?: (el?: Element, handle?: Element) => boolean;

        direction?: string;
        copy?: boolean;
        copySortSource?: boolean;
        revertOnSpill?: boolean;
        removeOnSpill?: boolean;
        mirrorContainer?: Element;
        ignoreInputTextSelection?: boolean;

        // Setting this option is effectively the same as passing the containers in the first argument to dragula(containers, options).
        containers?: Array<Element>;
    }

    export interface Drake {
        containers: Array<Element>;
        dragging: boolean;
        
        start(item: Element): void;
        end(): void;
        cancel(revert?: boolean): void;
        remove(): void;
        on(events: string, callback: Function): void;
        off(events: string, callback: Function): void;
        once(events: string, callback: Function): void;
        canMove(item: Element): boolean;
        destroy(): void;
    }

    export interface Dragula {
        new (containers: Element|Array<Element>, options?: DragulaOptions): Drake;
        new (options?: DragulaOptions): Drake;
        new (): Drake;
    }
}

declare let Dragula: dragula.Dragula;

declare module "aurelia-dragula" {
    export default Dragula;
}