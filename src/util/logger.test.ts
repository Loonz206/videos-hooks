import { logger } from './logger';

describe('logger', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it('writes structured warning logs', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn({
      event: 'test.warning',
      message: 'warn message',
      context: { foo: 'bar' },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'warn',
        event: 'test.warning',
        message: 'warn message',
        context: { foo: 'bar' },
      }),
    );
  });

  it('suppresses debug logs in test environment', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    logger.debug({
      event: 'test.debug',
      message: 'debug message',
    });

    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('allows info and error logs in non-test environments', () => {
    process.env.NODE_ENV = 'development';
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const boom = new Error('boom');

    logger.info({
      event: 'test.info',
      message: 'info message',
    });

    logger.error({
      event: 'test.error',
      message: 'error message',
      error: boom,
    });

    expect(infoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        event: 'test.info',
        message: 'info message',
      }),
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'error',
        event: 'test.error',
        message: 'error message',
        error: expect.objectContaining({
          name: 'Error',
          message: 'boom',
        }),
      }),
    );
  });

  it('serializes non-error values without crashing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error({
      event: 'test.non_error',
      message: 'non-error payload',
      error: 'string error',
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'error',
        event: 'test.non_error',
        error: undefined,
      }),
    );
  });
});
