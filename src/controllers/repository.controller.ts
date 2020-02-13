import { Controller, Post, Body } from '@nestjs/common';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { validate } from 'class-validator';
import { Config } from 'src/models/config';
import { SchemeBuilderService } from 'src/services/scheme-builder';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { RepositoryEntity } from 'src/database/entities/repository.entity';
import { AddRepositoryDto } from 'src/dtos/addRepository.dto';
import { RepositoryService } from 'src/services/repository';
import { RefreshRepositoryDto } from 'src/dtos/refreshRepository.dto';
const fsExists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

@Controller('/repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  async addRepository(@Body() body: AddRepositoryDto) {
    const repository = await this.repositoryService.create(body);
    return { success: true, data: repository };
  }

  @Post('/refresh')
  async refreshRepository(@Body() body: RefreshRepositoryDto) {
    await this.repositoryService.refresh(body);
    return { success: true, message: 'refreshed' };
  }

  @Post('/webhook')
  async webhook(
    @Body() body: { ref: string; repository: { clone_url: string } },
  ) {
    const repositoryUrl = body.repository.clone_url;
    const branchParts = body.ref.split('/');
    const branchName = branchParts[branchParts.length - 1];

    await this.repositoryService.webhook(repositoryUrl, branchName);

    return;
  }

  // @Post('/run')
  // async runRepository(@Body() body: { url: string; branch?: string }) {

  //   try {
  //     if (!!body.branch) {
  //       await git.checkout(body.branch);
  //     }

  //     const configPath = path.join(dir, 'config.json');

  //     const configExists = await fsExists(configPath);

  //     if (!configExists) {
  //       return { success: false, message: 'config.json does not exist' };
  //     }

  //     const schemePath = path.join(dir, 'scheme.json');

  //     const schemeExists = await fsExists(schemePath);

  //     if (!schemeExists) {
  //       return { success: false, message: 'scheme.json does not exist' };
  //     }

  //     const configFile = await readFile(configPath, 'utf8');
  //     const schemeFile = await readFile(schemePath, 'utf8');

  //     let config: Config;
  //     let scheme: EntitySchemaOptions<any>;

  //     try {
  //       config = JSON.parse(configFile);
  //     } catch (e) {
  //       return { success: false, message: 'config.json file is invalid JSON' };
  //     }

  //     try {
  //       scheme = JSON.parse(schemeFile);
  //     } catch (e) {
  //       return { success: false, message: 'schema.json file is invalid JSON' };
  //     }

  //     validate(config).then(errors => {
  //       if (errors.length > 0) {
  //         return { success: false, message: errors };
  //       }
  //     });

  //     this.schemeBuilder.generateScheme(scheme, 'dbName');

  //     return { success: true, config };
  //   } catch (e) {
  //     console.log(e);
  //     return {
  //       success: false,
  //       message: 'something went wrong while cloning your repo',
  //     };
  //   } finally {

  //   }
  // }
}
