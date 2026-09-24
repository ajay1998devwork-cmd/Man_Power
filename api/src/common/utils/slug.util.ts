export class SlugUtil {
  static generate(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '');
  }

  static generateUsername(agencyName: string): string {
    const base = this.generate(agencyName);
    return base.substring(0, 50);
  }
}
