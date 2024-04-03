import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionResponse } from './dto/create-transaction.response.dto';
import { CreateTransactionRequest } from './dto/create-transaction.request.dto';
import { TransactionService } from './transaction.service';
import { GetTransactionResponse } from './dto/get-transaction.response.dto';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionMicroserviceController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateTransactionResponse,
  })
  @ApiOperation({ description: 'Creation of a transaction' })
  async createTransaction(
    @Body() transactionData: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    return this.transactionService.createTransaction(
      transactionData,
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'The transaction identifier' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetTransactionResponse,
  })
  @ApiOperation({ description: 'Get a transaction' })
  async getTransaction(
    @Param('id') id: string,
  ): Promise<any> {
    return this.transactionService.getTransaction(id);
  }  
}
