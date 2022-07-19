import {INode, ITree, SORT_BY} from "../ds/property";

export const sortNode = (node: INode, sortBy: SORT_BY, depth: number): INode => {
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
    if (depth > 1) node.children = node.children.map(child => sortNode(child, sortBy, depth - 1))

    return node
}

/**
 * 对结构树进行重排序
 * @param tree
 * @param sortBy: 排序标准，拼音或者数量或者默认
 * @param sortDepth: 排序深度，1即排省份，2即排城市，3即排项目
 */
export const sortTree = (tree: ITree, sortBy: SORT_BY, sortDepth = 3): ITree => {
    if (!SORT_BY.includes(sortBy))
        console.warn(`sortBy of ${sortBy} not in ${SORT_BY}`)
    return sortNode(tree, sortBy, sortDepth)
}