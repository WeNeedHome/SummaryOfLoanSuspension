import path from "path";

// backend level
export const BACKEND_DIR = __dirname
export const TMP_DIR = path.join(BACKEND_DIR, "tmp")
export const DEVELOPMENT_DIR = path.dirname(BACKEND_DIR)

// project level
export const PROJECT_DIR = path.dirname(DEVELOPMENT_DIR)
export const README_PATH = path.join(PROJECT_DIR, "README.md")
export const IMAGES_DIR = path.join(PROJECT_DIR, "images")
export const DATA_DIR = path.join(PROJECT_DIR, "data")

// frontend level
export const FRONTEND_DIR = path.join(DEVELOPMENT_DIR, "frontend")
export const FRONTEND_REACT_DIR = path.join(FRONTEND_DIR, "react")
export const FRONTEND_REACT_SRC_DIR = path.join(FRONTEND_REACT_DIR, "src")

// data
export const DATA_CONFIG_DIR = path.join(DATA_DIR, "config")
export const DATA_GENERATED_DIR = path.join(DATA_DIR, "generated")
export const DATA_SOURCE_DIR = path.join(DATA_DIR, "source")
export const DATA_PROPERTIES_PATH = path.join(DATA_GENERATED_DIR, "properties.json")
export const DATA_VISUALIZATION_PATH = path.join(DATA_GENERATED_DIR, "cities-for-visualization.json")
