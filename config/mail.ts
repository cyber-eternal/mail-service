import { parseBoolean } from '@app/utils';

const productionConfig = {
  sendmail: true,
  newline: 'unix',
};

const auth = {
  user: process.env.SMTP_USER || 'maildev',
  pass: process.env.SMTP_PASS || 'password',
};

const debugConfig = {
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 1025,
  secure: parseBoolean(process.env.SMTP_SECURE, false),
  ignoreTLS: parseBoolean(process.env.SMTP_IGNORE_TLS, false),
  tls: {
    rejectUnauthorized: parseBoolean(
      process.env.SMTP_TLS_REJECT_UNAUTHORIZED,
      true,
    ),
  },
  ...(auth ? { auth } : {}),
};

export default {
  smtp: process.env.SMTP_PRODUCTION === 'true' ? productionConfig : debugConfig,
  defaultSender:
    process.env.SMTP_DEFAULT_SENDER || 'customer.portal@onsweb.com',
};
