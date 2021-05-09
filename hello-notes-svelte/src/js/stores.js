import { writable } from "svelte/store";

export const notes = writable([]);

export const current = writable(null);

export const categories = writable([]);
