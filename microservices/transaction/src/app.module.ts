import { Module } from "@nestjs/common";
import { TransactionModule } from "./transaction.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [ConfigModule.forRoot(), TransactionModule, HttpModule],
  providers: [],
})
export class AppModule {}
