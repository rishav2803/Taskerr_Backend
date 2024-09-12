import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateLink {
  constructor(private configService: ConfigService) { }

  generateLink(token: string, type: string): string {
    const baseUrl = this.configService.get<string>('BACKEND_BASE_URL');
    return `${baseUrl}${type}?token=${token}`;
  }

}

