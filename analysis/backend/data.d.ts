declare module "./region/region.json" {
    /**
     * ref: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
     */
    import {CountryData} from "./region/region.ds";
    const content: CountryData
    export default content
}