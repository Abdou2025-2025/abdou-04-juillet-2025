import { toast } from "sonner"

// Types d'erreurs
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK', 
  AUTH = 'AUTH',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType
  message: string
  details?: string
  code?: string
  timestamp: Date
}

// Classes d'erreurs personnalisées
export class ValidationError extends Error {
  public readonly type = ErrorType.VALIDATION
  public readonly timestamp = new Date()
  
  constructor(message: string, public details?: string, public code?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  public readonly type = ErrorType.NETWORK
  public readonly timestamp = new Date()
  
  constructor(message: string, public details?: string, public code?: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthError extends Error {
  public readonly type = ErrorType.AUTH  
  public readonly timestamp = new Date()
  
  constructor(message: string, public details?: string, public code?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class NotFoundError extends Error {
  public readonly type = ErrorType.NOT_FOUND
  public readonly timestamp = new Date()
  
  constructor(message: string, public details?: string, public code?: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

// Utilitaires de gestion d'erreur
export const errorHandler = {
  // Handle et log une erreur
  handle(error: unknown, context?: string): AppError {
    console.error(`Error in ${context || 'Unknown context'}:`, error)
    
    if (error instanceof ValidationError || 
        error instanceof NetworkError || 
        error instanceof AuthError ||
        error instanceof NotFoundError) {
      return {
        type: error.type,
        message: error.message,
        details: error.details,
        code: error.code,
        timestamp: error.timestamp
      }
    }
    
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        timestamp: new Date()
      }
    }
    
    return {
      type: ErrorType.UNKNOWN,
      message: 'Une erreur inattendue s\'est produite',
      timestamp: new Date()
    }
  },

  // Affiche un toast d'erreur
  showToast(error: AppError, showDetails = false) {
    const description = showDetails && error.details ? error.details : undefined
    
    toast.error(error.message, {
      description,
      duration: error.type === ErrorType.VALIDATION ? 4000 : 6000
    })
  },

  // Handle + toast en une fois
  handleAndShow(error: unknown, context?: string, showDetails = false): AppError {
    const appError = this.handle(error, context)
    this.showToast(appError, showDetails)
    return appError
  }
}

// Hook de base pour la gestion d'erreur dans les composants
export const useErrorHandler = () => {
  return {
    handleError: (error: unknown, context?: string, showToast = true) => {
      const appError = errorHandler.handle(error, context)
      if (showToast) {
        errorHandler.showToast(appError)
      }
      return appError
    }
  }
}

// Wrapper pour les fonctions async qui peuvent échouer
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
  showToast = true
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await fn()
    return { data }
  } catch (error) {
    const appError = errorHandler.handle(error, context)
    if (showToast) {
      errorHandler.showToast(appError)
    }
    return { error: appError }
  }
}