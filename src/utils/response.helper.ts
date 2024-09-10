import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseHelper {
  static success(res: Response, data: any, message: string, status: number) {
    return res.status(status).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res: Response, error: any) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

