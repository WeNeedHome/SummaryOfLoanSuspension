declare module "data/citiesOnMap.json" {
    import {CitiesOnMap} from "ds";
    /**
     * ref: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
     */
    const content: CitiesOnMap
    export default content
}