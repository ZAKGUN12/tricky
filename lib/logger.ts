interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  
  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, meta?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    };
    
    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;
      console.log(`${prefix} ${entry.message}`, meta || '');
      if (error) {
        console.error(error);
      }
    }
  }
  
  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }
  
  error(message: string, error?: Error, meta?: any) {
    this.log('error', message, meta, error);
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }
  
  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();
