import PocketBase from "pocketbase"
import { PUBLIC_PB_URL } from "$env/static/public"

const baseUrl = PUBLIC_PB_URL

if (!baseUrl) {
  console.warn("PUBLIC_PB_URL is not set. PocketBase client may fail to connect.")
}

export const pb = new PocketBase(baseUrl)
