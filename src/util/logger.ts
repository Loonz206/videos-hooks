type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  event: string;
  message?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

interface StructuredLog extends Omit<LogEntry, 'error'> {
  level: LogLevel;
  timestamp: string;
  error?: { name: string; message: string; stack?: string };
}

const shouldLog = (level: LogLevel): boolean => {
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV === 'test'
  ) {
    return level === 'warn' || level === 'error';
  }

  return true;
};

const serializeError = (error: unknown): StructuredLog['error'] => {
  if (!(error instanceof Error)) {
    return undefined;
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
};

const toStructuredLog = (level: LogLevel, entry: LogEntry): StructuredLog => {
  return {
    level,
    timestamp: new Date().toISOString(),
    event: entry.event,
    message: entry.message,
    context: entry.context,
    error: serializeError(entry.error),
  };
};

const writeLog = (level: LogLevel, entry: LogEntry): void => {
  if (!shouldLog(level)) {
    return;
  }

  const structuredLog = toStructuredLog(level, entry);
  const sink =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : level === 'info'
          ? console.info
          : console.debug;

  sink(structuredLog);
};

const logger = {
  debug: (entry: LogEntry) => writeLog('debug', entry),
  info: (entry: LogEntry) => writeLog('info', entry),
  warn: (entry: LogEntry) => writeLog('warn', entry),
  error: (entry: LogEntry) => writeLog('error', entry),
};

export { logger };
