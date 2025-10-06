interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  
  private log(level: 'info' | 'warn' | 'error', message: string, meta?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };
    
    this.logs.push(entry);
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, meta || '');
    }
  }
  
  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }
  
  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }
  
  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();
