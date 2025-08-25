export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
  STEP: 'step';
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  STEP: 'step'
};

export class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: 'error' | 'warn' | 'info' | 'debug' | 'step', message: string, data?: any): void {
    if (typeof window === 'undefined') return; // Skip logging on server side
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    const logData = data ? JSON.stringify(data) : '';
    switch (level) {
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      case 'info':
        if (this.isDevelopment) {
          console.info(logMessage, logData);
        }
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logMessage, logData);
        }
        break;
      case 'step':
        if (this.isDevelopment) {
          console.log(logMessage, logData);
        }
        break;
    }
  }

  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  public step(message: string, data?: any): void {
    this.log('step', message, data);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions
export const logError = (message: string, data?: any) => logger.error(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logStep = (message: string, data?: any) => logger.step(message, data);