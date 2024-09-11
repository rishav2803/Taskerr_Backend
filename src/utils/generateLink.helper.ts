import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateLink {
  constructor(private configService: ConfigService) { }

  generateLink(token: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL');
    return `${baseUrl}/verify?token=${token}`;
  }
}

