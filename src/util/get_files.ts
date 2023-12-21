import { readdirSync, type Dirent } from 'fs'

/**
 * Recursively retrieves all files in a directory.
 * @param mod - The path of the directory to search.
 * @param result - An optional array to store the resulting directory entries (files and subdirectories).
 * @returns {Dirent[]} - An array of Dirent objects representing the files and subdirectories in the specified directory.
 */
export function get_files (mod: string, result: Dirent[] = []): Dirent[] {
  const files = readdirSync(mod, { withFileTypes: true })

  for (const file of files) {
    file.name = `${mod}/${file.name}`

    // If the current entry is a subdirectory, recursively call the function to retrieve files within the subdirectory.
    // Otherwise, it is a file, so add it to the result array.
    file.isDirectory() ? get_files(file.name, result) : result.push(file)
  }

  return result
}
