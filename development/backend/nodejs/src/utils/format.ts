import { IItem } from "../itree/ds";

export const formatItemLine = (item: IItem) => {
    return item.uri
        ? `[${item.name}](${item.uri})` // 如果有 uri，就返回超链接形式
        : item.name                     // 否则就返回纯文本
}