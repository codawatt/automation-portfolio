const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];


for (const key of required){
    if (!process.env[key]){
        throw new Error(`Missing env variable: ${key}`);
    }
}

export const config = {
    port: Number(process.env.PORT ?? 3000),
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
   ai: {
       baseUrl: process.env.OLLAMA_URL ?? 'http://ollama:11434',
       model: process.env.AI_MODEL,
       timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 60000),
       pricing: {
          inPerMillion: Number(process.env.AI_PRICE_IN_PER_1M ?? 0),
          outPerMillion: Number(process.env.AI_PRICE_OUT_PER_1M ?? 0),
    },
  },
};
