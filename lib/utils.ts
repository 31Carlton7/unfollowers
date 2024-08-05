/**
 * This file contains utility functions.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and concatenates class names using the `clsx` and `twMerge` functions.
 *
 * @param {ClassValue[]} inputs - An array of class values to be merged and concatenated.
 * @return {string} - The merged and concatenated class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
