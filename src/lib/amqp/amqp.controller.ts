import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Amqp from 'amqplib';
import { Observable, Subscriber } from 'rxjs';
import { safeJsonParse } from '@app/utils/json/index';
import amqpConnection from './amqp-connection';
import { validate } from 'class-validator';
import R from 'ramda';
import { MessageDto } from './dto/payload.dto';
import {
  EXCHANGE_TYPE,
  ROUTING_KEY,
  ERROR_QUEUE_KEY,
} from '@app/lib/amqp/constants';
import { EmailData } from '@app/interfaces/email-data-interface';

@Injectable()
export class AMQPController {
  private connection: Amqp.Connection;
  private channel: Amqp.Channel;
  private queueListener: any;

  private readonly logger = new Logger(AMQPController.name);

  protected constructor(
    connectionString: string,
    queue: string,
    exchangeName: string,
    queuePrefix: string,
  ) {
    const queueFullName = `${queuePrefix}-${queue}`;
    this.init(connectionString, queueFullName, exchangeName);
  }

  private async init(
    connectionString: string,
    queue: string,
    exchangeName: string,
  ) {
    this.connection = await amqpConnection(connectionString);
    this.queueListener = await this.listen(queue, exchangeName);

    this.queueListener.subscribe(async (message: any) => {
      const content = safeJsonParse(message.content.toString());

      const payload = new MessageDto(content) as EmailData;

      try {
        await this.validate(payload);

        await this.handleMessage(payload);

        this.channel.ack(message);
      } catch (error) {
        this.logger.error(error);
        this.channel.nack(message, false, false);

        await this.publishError(queue, content, error);
      }
    });
  }

  private async publishError(
    queueName: string,
    payload: any,
    err: Error,
  ): Promise<void> {
    const errorQueueName = this.createErrorQueueName(queueName);
    const errorMessage = err.message || err;

    this.publishToQueue(errorQueueName, { payload, error: errorMessage });
  }

  private async listen(
    queueName: string,
    exchangeName: string,
  ): Promise<Observable<Amqp.Message>> {
    const channel = await this.connection.createChannel();
    this.channel = channel;

    await this.initChanel(queueName, exchangeName);

    return new Observable<any>(
      (subscriber: Subscriber<Amqp.ConsumeMessage>) => {
        const handler = (message: Amqp.ConsumeMessage) => {
          subscriber.next(message);
        };
        const unsubscribe = async () => {
          await this.channel.close();
        };

        subscriber.add(unsubscribe);
        channel.consume(queueName, handler);
      },
    );
  }

  private async initChanel(
    queueName: string,
    exchangeName: string,
  ): Promise<void> {
    const errorQueueName = this.createErrorQueueName(queueName);

    await this.channel.assertQueue(queueName);
    await this.channel.assertQueue(errorQueueName);
    await this.channel.assertExchange(exchangeName, EXCHANGE_TYPE);
    await this.channel.bindQueue(queueName, exchangeName, ROUTING_KEY);
  }

  private createErrorQueueName(queueName: string): string {
    return queueName + '.' + ERROR_QUEUE_KEY;
  }

  private publishToQueue(queueName: string, data: object): void {
    try {
      const buffer = R.pipe(JSON.stringify, Buffer.from)(data);
      this.channel.sendToQueue(queueName, buffer);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  protected async handleMessage(payload: MessageDto) {
    throw new Error('Not Implemented');
  }

  protected async validate(data: any): Promise<void> {
    return validate(data).then(errors => {
      if (errors.length > 0) {
        this.logger.error(JSON.stringify(errors, null, 2));
        throw new BadRequestException('Validation failed');
      }
    });
  }
}
