import path from "path";

// backend level
export const BACKEND_DIR = __dirname
export const DEVELOPMENT_DIR = path.dirname(BACKEND_DIR)

// project level
export const PROJECT_DIR = path.dirname(DEVELOPMENT_DIR)
export const README_PATH = path.join(PROJECT_DIR, "README.md")
export const IMAGES_DIR = path.join(PROJECT_DIR, "images")
export const DATA_DIR = path.join(PROJECT_DIR, "data")
export const DATA_GENERATED_DIR = path.join(DATA_DIR, "generated")
export const DATA_SOURCE_DIR = path.join(DATA_DIR, "source")

// frontend level
export const FRONTEND_DIR = path.join(DEVELOPMENT_DIR, "frontend")
export const FRONTEND_SRC_DIR = path.join(FRONTEND_DIR, "src")
export const FRONTEND_SRC_DATA_DIR = path.join(FRONTEND_SRC_DIR, "data")