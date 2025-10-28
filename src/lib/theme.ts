import { writable } from 'svelte/store'

export const theme = writable(true) // true = dark, false = light

export function toggleTheme() {
  theme.update((d) => !d)
}
