declare module "data/cities-for-visualization.json" {
    import {AddressWithCount} from "./visualization/ds";
    /**
     * ref: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
     */
    const content: AddressWithCount[]
    export default content
}