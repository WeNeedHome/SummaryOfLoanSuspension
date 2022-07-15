import path from "path";

export const BACKEND_DIR = __dirname
export const ANALYSIS_DIR = path.dirname(BACKEND_DIR)
export const FRONTEND_DIR = path.join(ANALYSIS_DIR, "frontend")
export const FRONTEND_SRC_DIR = path.join(FRONTEND_DIR, "src")
export const FRONTEND_SRC_DATA_DIR = path.join(FRONTEND_SRC_DIR, "data")
export const PROJECT_DIR = path.dirname(ANALYSIS_DIR)
export const README_PATH = path.join(PROJECT_DIR, "README.md")