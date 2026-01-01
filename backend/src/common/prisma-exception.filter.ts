import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle Prisma unique constraint error
    if (exception && exception.code === 'P2002') {
      const meta = exception.meta || {};
      const target = meta.target ? (Array.isArray(meta.target) ? meta.target.join(', ') : meta.target) : 'field';
      const message = `Unique constraint failed on the ${target}`;
      return response.status(409).json({ statusCode: 409, message, error: 'Conflict' });
    }

    // If it's already an HttpException, preserve it
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    // Fallback
    return response.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
}
