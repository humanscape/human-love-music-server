import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PageRequest, PageResponse } from 'src/interface-adapters/dtos';
import { DigestService } from './digest.service';
import { CreateDigestRequest, DigestResponse } from './dtos';

@Controller('digests')
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  @Get()
  getMany(
    @Query(new ValidationPipe({ transform: true })) query: PageRequest,
  ): Promise<PageResponse<DigestResponse>> {
    return this.digestService.getMany(query);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<DigestResponse> {
    return this.digestService.get(id);
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
