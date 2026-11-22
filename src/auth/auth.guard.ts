import { 
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
 } from '@nestjs/common'
 import { JwtService } from '@nestjs/jwt'


 @Injectable()
 export class AuthGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = (request.headers as { authorization?: string }).authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token tidak tersedia');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = await this.jwtService.verify(token);
            // [MODIFIED] Assign JWT payload to request.user so controllers can access request.user.sub
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Token tidak valid atau kedaluwarsa');
        }
    }

 }