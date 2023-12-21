/**
 * Checks if a class is extending from another class in its prototype chain.
 * @param cls - The class to check.
 * @param father - The class to check if it is in the prototype chain of 'cls'.
 * @returns {boolean} - True if 'cls' is extending from 'father', otherwise false.
 */
export function is_extending_to (cls: unknown, father: unknown): boolean {
  try {
    // Traverse the prototype chain of 'cls' until it reaches the 'Object' class.
    // If 'father' is found during the traversal, it means 'cls' is extending from it.
    while (cls !== Object) {
      if (cls === father) {
        return true
      }
      cls = Object.getPrototypeOf(cls)
    }
    // If the loop completes without finding 'father', then 'cls' is not extending from it.
    return false
  } catch {
    // In case of any error during the traversal, return false.
    return false
  }
}
