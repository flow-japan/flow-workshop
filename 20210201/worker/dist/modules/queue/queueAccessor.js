"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueAccessor = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;
const projectId = 'flow-demo-302104';
class QueueAccessor {
    constructor() {
        this.subClient = new pubsub_1.v1.SubscriberClient();
    }
    async register(messages) {
        const pubSubClient = new pubsub_1.PubSub();
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
            }
            catch (err) {
                console.error(err);
                return;
            }
        }
        return await Promise.all(messages.map(async (aMessage) => {
            await publish(aMessage);
        }));
    }
    async pullMessages() {
        // Creates a client; cache this for further use.
        const formattedSubscription = this.subClient.subscriptionPath(projectId, subscriptionName);
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
    async ack(arrayAckIds) {
        const formattedSubscription = this.subClient.subscriptionPath(projectId, subscriptionName);
        const ackRequest = {
            subscription: formattedSubscription,
            ackIds: arrayAckIds,
        };
        //..acknowledges the message.
        return await this.subClient.acknowledge(ackRequest);
    }
}
const queueAccessor = new QueueAccessor();
exports.queueAccessor = queueAccessor;
