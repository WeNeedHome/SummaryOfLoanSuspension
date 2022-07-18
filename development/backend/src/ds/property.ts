/**
 * 第二版接口，for development/backend/src/genPropertiesFromReadme.ts
 */
export interface IItem {
    name: string
    uri: string
}

export interface IFlatItem extends IItem{
    city: string
    province: string
}

export interface INode {
    name: string
    count: number   // 文档中的标记总数
    children: any[]
}

export interface ICity extends INode {children: IItem[]}

export interface IProv extends INode {children: ICity[]}

export interface ITree extends INode {children: IProv[]}

// choice for development/backend/src/validateLocalImages.ts
export const PROPERTIES_SOURCE_TYPE = ['flat', 'tree'] as const
export type PROPERTIES_SOURCE_TYPE = typeof PROPERTIES_SOURCE_TYPE[number]

// sort for development/backend/src/genMdFromPropertiesTree.ts
export const SORT_BY = ["default", "pronunciation", 'count'] as const
export type SORT_BY = typeof SORT_BY[number]
export const SORT_BY_DICT_CN: Record<SORT_BY, string> = {
    default      : "默认",
    pronunciation: "拼音升序",
    count        : "数量降序"
}
