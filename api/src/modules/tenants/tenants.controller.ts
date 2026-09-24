import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Session,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('tenants')
@UseGuards(AuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(
    @Body() createTenantDto: CreateTenantDto,
    @Session() session: Record<string, any>,
  ) {
    return this.tenantsService.create(createTenantDto, session.userId);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.tenantsService.findAll(pageNum, limitNum, search);
  }

  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.tenantsService.getDashboardStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTenantStatusDto,
    @Session() session: Record<string, any>,
  ) {
    return this.tenantsService.updateStatus(id, updateStatusDto, session.userId);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
    @Session() session: Record<string, any>,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!documentType) {
      throw new BadRequestException('Document type is required');
    }

    return this.tenantsService.uploadDocument(id, file, documentType, session.userId);
  }
}
