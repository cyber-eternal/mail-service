# Mail Service

## For running

Run maildev and rabbitmq - `docker-compose up -d`

### RabbitMQ UI will be available on

```txt
Host: http://localhost:15672
Username: onsweb-mail
Password: password
```

### MailDev UI will be available on

```txt
Host: http://localhost:1080
Username: admin
Password: password
```

Run - `yarn` and then `yarn start:debug`

In debug mode will be used `./nodemon-debug.josn`.

Find environment variables to configure in the `.env.dist`.

By default, in the debug mode server will be available in `http://localhost:3001`

## Configs

Configs directory - `./config`

## Templates

Templates directory - `./templates`.
After running `yarn build`, the `templates` directory will be automatically copied to the `dist` directory.
You can add needed templates to that directory based on existing examples.
In a case, when the provided template was not found in the templates directory, the email will be sent by default template.
Currently, we have simple templates for `test`, `default`, and `new-document`.

## RabbitMQ

IMPORTANT: currently, the `amqp` module expects the next data format:

```json
{
  "templateName": "test", // required
  "to": "example@example.com", // required
  "data": {
    // required, here should be specific parameters for the specified template
    "subject": "My Subject", // optional
    "exampleParameter": "Example value" // optional
  },
  "language": "en", // required
  "from": "example@example.com", // optional
  "cc": ["example@example.com"], // optional
  "bcc": ["example@example.com"], // optional
  "attachments": [
    // optional
    {
      "filename": "example.zip", // required, if attachments provided
      "content": "BASE64_STRING", // required, if attachments provided
      "encoding": "base64", // required, if attachments provided
      "contentType": "application/zip" // required, if attachments provided
    }
  ]
}
```

The exchange name for now is `send-email`, and specified in the `./src/lib/amqp/exchange.enum.ts` as a `mailExchange`.
