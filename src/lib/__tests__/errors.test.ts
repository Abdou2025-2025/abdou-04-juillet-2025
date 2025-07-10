import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  ValidationError, 
  NetworkError, 
  AuthError,
  errorHandler,
  withErrorHandling,
  ErrorType 
} from '../errors';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('Error Classes', () => {
  it('ValidationError should have correct properties', () => {
    const error = new ValidationError('Invalid email', 'Email format is wrong');
    
    expect(error.name).toBe('ValidationError');
    expect(error.type).toBe(ErrorType.VALIDATION);
    expect(error.message).toBe('Invalid email');
    expect(error.details).toBe('Email format is wrong');
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('NetworkError should have correct properties', () => {
    const error = new NetworkError('Connection failed', 'Network timeout');
    
    expect(error.name).toBe('NetworkError');
    expect(error.type).toBe(ErrorType.NETWORK);
    expect(error.message).toBe('Connection failed');
    expect(error.details).toBe('Network timeout');
  });

  it('AuthError should have correct properties', () => {
    const error = new AuthError('Unauthorized', 'Invalid token', 'AUTH001');
    
    expect(error.name).toBe('AuthError');
    expect(error.type).toBe(ErrorType.AUTH);
    expect(error.message).toBe('Unauthorized');
    expect(error.details).toBe('Invalid token');
    expect(error.code).toBe('AUTH001');
  });
});

describe('errorHandler', () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should handle ValidationError correctly', () => {
    const validationError = new ValidationError('Invalid input');
    const appError = errorHandler.handle(validationError, 'Test context');

    expect(appError.type).toBe(ErrorType.VALIDATION);
    expect(appError.message).toBe('Invalid input');
    expect(consoleSpy).toHaveBeenCalledWith('Error in Test context:', validationError);
  });

  it('should handle generic Error correctly', () => {
    const genericError = new Error('Something went wrong');
    const appError = errorHandler.handle(genericError, 'Test context');

    expect(appError.type).toBe(ErrorType.UNKNOWN);
    expect(appError.message).toBe('Something went wrong');
  });

  it('should handle unknown error types', () => {
    const unknownError = 'String error';
    const appError = errorHandler.handle(unknownError, 'Test context');

    expect(appError.type).toBe(ErrorType.UNKNOWN);
    expect(appError.message).toBe('Une erreur inattendue s\'est produite');
  });

  it('should handle null/undefined errors', () => {
    const appError = errorHandler.handle(null);

    expect(appError.type).toBe(ErrorType.UNKNOWN);
    expect(appError.message).toBe('Une erreur inattendue s\'est produite');
  });
});

describe('withErrorHandling', () => {
  it('should return data when function succeeds', async () => {
    const successFn = async () => 'success result';
    const result = await withErrorHandling(successFn, 'Test context', false);

    expect(result.data).toBe('success result');
    expect(result.error).toBeUndefined();
  });

  it('should return error when function fails', async () => {
    const failFn = async () => {
      throw new ValidationError('Test error');
    };
    
    const result = await withErrorHandling(failFn, 'Test context', false);

    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.type).toBe(ErrorType.VALIDATION);
    expect(result.error?.message).toBe('Test error');
  });

  it('should handle async functions that throw regular errors', async () => {
    const failFn = async () => {
      throw new Error('Regular error');
    };
    
    const result = await withErrorHandling(failFn, 'Test context', false);

    expect(result.error?.type).toBe(ErrorType.UNKNOWN);
    expect(result.error?.message).toBe('Regular error');
  });
});