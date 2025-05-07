export class WalletError extends Error {
  public code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
  }

  static fromUnknown(error: unknown, code: string, fallbackMsg?: string): WalletError {
    if (error instanceof WalletError) {
      return error;
    }

    if (error instanceof Error) {
      const message = fallbackMsg && (!error.message || error.message === "Error") ? fallbackMsg : error.message;
      return new WalletError(code, message);
    }
    return new WalletError(code, fallbackMsg || "An unknown error occurred");
  }
}
