import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UiString, UiStringSchema } from './ui-string.schema';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UiString.name, schema: UiStringSchema }])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
