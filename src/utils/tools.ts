export class Tools {
  static getLocalDateISO(): string {
    const now = new Date()
    return new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString()
  }

  static getLocalDate(): Date {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  }
}
