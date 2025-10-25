// Simple logger utility for structured logging

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    console.log(JSON.stringify(logEntry));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }
}

export const logger = new Logger();
