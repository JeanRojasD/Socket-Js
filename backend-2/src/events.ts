import { ValidationErrorItem } from 'joi'

export interface IError {
  error: string
  errorDetails?: ValidationErrorItem[]
}

export interface ISuccess<T> {
  data: T
}

export type IResponse<T> = IError | ISuccess<T>

export interface IServerEvents {
  'message:sended': (message: string) => void
}

export interface IClientEvents {
  'message:repass': (message: string, callback: any) => void
}
