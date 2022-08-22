/**
 * 第二版接口，for development/backend/src/genProperties.ts
 */
export interface IItem {
    name: string
    uri: string
    developer: string
}

export interface IFlatItem extends IItem {
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