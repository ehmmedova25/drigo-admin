import { CAR_PHOTO } from '@/constants/config';

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const toCarPhotoPaths = (name: string) => CAR_PHOTO.exts.map((ext) => `${CAR_PHOTO.dir}/${name}${ext}`);

export const toModelPhotoPaths = (brand: string, model: string) => toCarPhotoPaths(toSlug(`${brand} ${model}`));
