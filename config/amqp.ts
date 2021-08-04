export default {
  hostname: process.env.AMQP_HOST || 'localhost',
  port: process.env.AMQP_PORT || 5672,
  emailQueueName: process.env.AMQP_EMAIL_QUEUE || 'send_email',
  username: process.env.AMQP_USERNAME || 'onsweb-docs',
  password: process.env.AMQP_PASSWORD || 'password',
  queuePrefix: process.env.AMQP_QUEUE_PREFIX || 'qa',
  virtualHost: process.env.AMQP_VHOST || null,
  get connectionString() {
    const { hostname, port, username, password, virtualHost } = this;
    if (virtualHost) {
      return `amqp://${username}:${password}@${hostname}:${port}/${virtualHost}`;
    }
    return `amqp://${username}:${password}@${hostname}:${port}`;
  },
};
