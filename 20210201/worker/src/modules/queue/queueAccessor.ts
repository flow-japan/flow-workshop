import { PubSub, v1 } from '@google-cloud/pubsub';

const topicName = process.env.TOPIC_NAME as string;
const subscriptionName = process.env.SUBSCRIPTION_NAME as string;
const projectId = 'flow-demo-302104';

class QueueAccessor {
  private readonly subClient = new v1.SubscriberClient();
  async register(messages: string[]) {
    const pubSubClient = new PubSub();
    const batchPublisher = pubSubClient.topic(topicName, {
      batching: {
        maxMessages: 100,
        maxMilliseconds: 10000,
      },
    });
    async function publish(message) {
      const dataBuffer = Buffer.from(message);
      try {
        const messageId = await batchPublisher.publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        return messageId;
      } catch (err) {
        console.error(err);
        return;
      }
    }
    return await Promise.all(
      messages.map(async (aMessage) => {
        await publish(aMessage);
      }),
    );
  }
  async pullMessages() {
    // Creates a client; cache this for further use.
    const formattedSubscription = this.subClient.subscriptionPath(
      projectId,
      subscriptionName,
    );
    // The maximum number of messages returned for this request.
    // Pub/Sub may return fewer than the number specified.
    const maxMessages = 30;
    const request = {
      subscription: formattedSubscription,
      maxMessages: maxMessages,
    };

    // The subscriber pulls a specified number of messages.
    const [response] = await this.subClient.pull(request);
    return response;
  }
  async ack(arrayAckIds: string[]) {
    const formattedSubscription = this.subClient.subscriptionPath(
      projectId,
      subscriptionName,
    );

    const ackRequest = {
      subscription: formattedSubscription,
      ackIds: arrayAckIds,
    };

    //..acknowledges the message.
    return await this.subClient.acknowledge(ackRequest);
  }
}

const queueAccessor = new QueueAccessor();
export { queueAccessor };
