import { INode, ITree } from "./ds";

// sort for development/backend/src/genMarkdown.ts
export const SORT_BY = ["default", "pronunciation", 'count'] as const
export type SORT_BY = typeof SORT_BY[number]
export const SORT_BY_DICT_CN: Record<SORT_BY, string> = {
    default      : "默认",
    pronunciation: "拼音升序",
    count        : "数量降序"
}

export const sortINode = (node: INode, sortBy: SORT_BY, depth: number): INode => {
    // 当没有孩子的时候，已经是属于楼盘级别了，数量排序已失效，所以不如转成拼音排序
    if (node.children.length && !node.children[0].children) sortBy = "pronunciation"

    switch (sortBy) {
        case "pronunciation":
            node.children = node.children.sort((n1, n2) => n1.name.localeCompare(n2.name, 'zh'))
            break
        case 'count':
            node.children = node.children.sort((n1, n2) => n2.count - n1.count)
            break
        case 'default':
            break
        default:
            break
    }

    // recursive
    if (depth > 1) node.children = node.children.map(child => sortINode(child, sortBy, depth - 1))

    return node
}
/**
 * 对结构树进行重排序
 * @param tree
 * @param sortBy: 排序标准，拼音或者数量或者默认
 * @param sortDepth: 排序深度，1即排省份，2即排城市，3即排项目
 */
export const sortITree = (tree: ITree, sortBy: SORT_BY, sortDepth = 3): ITree => {
    if (!SORT_BY.includes(sortBy))
        console.warn(`sortBy of ${sortBy} not in ${SORT_BY}`)
    return sortINode(tree, sortBy, sortDepth)
}