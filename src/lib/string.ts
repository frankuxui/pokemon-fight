export class StringUtils {
  static capitalizeFirstLetter (string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  static lowercase (string: string): string {
    return string.toLowerCase()
  }

  static uppercase (string: string): string {
    return string.toUpperCase()
  }

  static trim (string: string): string {
    return string.trim()
  }
}