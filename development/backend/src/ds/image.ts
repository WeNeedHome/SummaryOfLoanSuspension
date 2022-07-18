export const IMAGE_TYPES = ['png', 'jpg', 'jpeg'] as const
export type IMAGE_TYPE = typeof IMAGE_TYPES[number]