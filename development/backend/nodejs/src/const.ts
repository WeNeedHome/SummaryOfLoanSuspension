import path from "path";

// backend level
export const NODEJS_SRC_DIR     = __dirname
export const BACKEND_NODEJS_DIR = path.dirname(NODEJS_SRC_DIR)
export const BACKEND_DIR        = path.dirname(BACKEND_NODEJS_DIR)
export const DEVELOPMENT_DIR    = path.dirname(BACKEND_DIR)

// project dir
export const PROJECT_DIR = path.dirname(DEVELOPMENT_DIR)
export const README_PATH = path.join(PROJECT_DIR, "README.md")
export const IMAGES_DIR  = path.join(PROJECT_DIR, "images")
export const DATA_DIR    = path.join(PROJECT_DIR, "data")

// frontend dir
export const FRONTEND_DIR           = path.join(DEVELOPMENT_DIR, "frontend")
export const FRONTEND_REACT_DIR     = path.join(FRONTEND_DIR, "react")
export const FRONTEND_REACT_SRC_DIR = path.join(FRONTEND_REACT_DIR, "src")

// data dir
export const DATA_CONFIG_DIR               = path.join(DATA_DIR, "config")
export const DATA_CONFIG_GOOGLE_THEME_PATH = path.join(DATA_CONFIG_DIR, 'google-themes')
export const DATA_GENERATED_DIR            = path.join(DATA_DIR, "generated")
export const DATA_SOURCE_DIR               = path.join(DATA_DIR, "source")

// generated data dir
export const PROPERTIES_TREE_PATH    = path.join(DATA_GENERATED_DIR, 'properties-tree.json')
export const PROPERTIES_FLAT_PATH    = path.join(DATA_GENERATED_DIR, "properties-flat.json")
export const DATA_VISUALIZATION_PATH = path.join(DATA_GENERATED_DIR, "cities-for-visualization.json")

// regex for parsing readme(v1)
export const REG_START         = /^## 分省数据/
export const REG_END           = /^## \S/
export const REG_TOTAL         = /总计[:：]\s*【\**(\d+)\+\**】/ // countryTotal
export const REG_PROV          = /^### (.*?)\s*\[\s*(\d+)\s*\]/ // provinceName, provinceTotal
export const REG_CITY          = /^-\s*\*\*(.*?)\s*[（(](\d+)[)）].*?\*\*\s*(.*?)$/ // cityName, cityTotal, properties
export const REG_ITEM_WITH_URI = /\[(.*?)\]\((.*?)\)/
export const REG_ITEM          = /\[(.*?)\]\((.*?)\)|(.*)/ // propertyName, [propertyUri]
export const ITEM_SEP          = /\s*,\s*/

