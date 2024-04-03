import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.consumer.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [KafkaConsumerService],
})
export class AppModule {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) {}

  async onModuleInit() {
    await this.kafkaConsumerService.connect();
  }

  async onApplicationShutdown(signal: string) {
    await this.kafkaConsumerService.disconnect();
  }
}
