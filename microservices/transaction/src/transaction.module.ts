import { Module } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { TransactionMicroserviceController } from './transaction.controller';
import { KafkaModule } from './kafka/kafka.module';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule,KafkaModule],
  controllers: [TransactionMicroserviceController],
  providers: [TransactionService],
})
export class TransactionModule {}
