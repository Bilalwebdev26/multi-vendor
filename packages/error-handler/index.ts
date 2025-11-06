export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isoperational: true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isoperational;
    this.details = details;
    //Error.captureStackTrace(this, this.constructor);
  }
}
//not found error
export class NotFound extends AppError {
  constructor(
    message = "Resources Not found",
    details?: any
  ) {
    super(message,404,true,details);
  }
}
//validation error joi/zod etc
export class ValidationError extends AppError{
   constructor(message="Invalid Request Data",details?:any){
    super(message,400,true,details)
   }
}
//JWT auth error
export class AuthError extends AppError{
    constructor(message="Unauthorizes",details?:any){
        super(message,401,true,details)
    }
}
//Forbidden access error
export class ForbiddenError extends AppError{
    constructor(message="Forbidden access",details?:any){
        super(message,403,true,details)
    }
}
//database error
export class DatabaseError extends AppError{
    constructor(message="Database Error",details?:any){
        super(message,500,true,details)
    }
}
//rate limiting error
export class RateLimitError extends AppError{
    constructor(message="Too many requests try again later",details?:any){
        super(message,429,true,details)
    }
}