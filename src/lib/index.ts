import PocketBase from 'pocketbase';
import { PUBLIC_PB_URL, PUBLIC_BUILD_ENV } from '$env/static/public';

const baseUrl = PUBLIC_PB_URL;

export const pb = new PocketBase(baseUrl);
export const isDev = PUBLIC_BUILD_ENV === 'development';
