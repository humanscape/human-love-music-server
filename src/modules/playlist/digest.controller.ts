import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { DigestService } from './digest.service';
import { CreateDigestRequest, DigestResponse } from './dto';

@Controller('digests')
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  @Get()
  getMany() {
    // TODO:
    // input: page, limit
    // playlist.findMany({ type: digest, ... })
  }

  @Get(':id')
  get() {
    // TODO:
  }

  @Get(':id/tracks')
  getTracks() {
    // TODO:
  }

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) body: CreateDigestRequest,
  ): Promise<DigestResponse> {
    return this.digestService.create(body);
  }

  // TODO: createMonthly
}
