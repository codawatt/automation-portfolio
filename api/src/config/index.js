const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];


for (const key of required){
    if (!process.env[key]){
        throw new Error('Missing env variable: ${key}');
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
};
