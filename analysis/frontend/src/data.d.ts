declare module "data/citiesOnMap.json" {
    import {AddressWithCount} from "ds";
    /**
     * ref: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
     */
    const content: Record<string, AddressWithCount>
    export default content
}