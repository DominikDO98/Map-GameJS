export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RABBITMQ_DEFAULT_PASS: string;
      RABBITMQ_DEFAULT_USER: string;
      RABBITMQ_DEFAULT_VHOST: string;
      RABBITMQ_URL: string;

      TIMEOUT: string;
    }
  }
}
