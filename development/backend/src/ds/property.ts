/**
 * 第一版接口
 */

export interface Property {
    province: string
    city: string
    name: string
    link?: string
    month?: number
}

/**
 * 第二版接口
 */
export interface IItem {
    name: string
    uri: string
}

export interface INode {
    name: string
    count: number   // 文档中的标记总数
    children: any[]
}

export interface ICity extends INode {children: IItem[]}

export interface IProv extends INode {children: ICity[]}

export interface ITree extends INode {children: IProv[]}

// 排序顺序，默认、拼音、数量
export enum SORT_BY  {
    default = '默认',
    pronunciation ='拼音升序',
    count = "数量降序"
}
