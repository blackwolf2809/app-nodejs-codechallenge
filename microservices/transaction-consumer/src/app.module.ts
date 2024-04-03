import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TransactionConsumerService } from "./transaction.consumer.service";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [TransactionConsumerService],
})
export class AppModule {
  constructor(
    private readonly transactionConsumerService: TransactionConsumerService
  ) {}

  async onModuleInit() {
    await this.transactionConsumerService.connect();
  }

  async onApplicationShutdown(signal: string) {
    await this.transactionConsumerService.disconnect();
  }
}
