import { app } from './server';
import { config } from './config';
import { initParser } from './openapi/parser';

async function bootstrap() {
    console.log('[Boot] Starting Ghost-Environment process...');
    
    try {
        console.log(`[Boot] Attempting to load OpenAPI spec from: ${config.SPEC_PATH}`);
        await initParser(config.SPEC_PATH);
        console.log(`[Boot] SUCCESS: OpenAPI spec loaded.`);
    } catch (error) {
        console.error(`[Boot] WARNING: Failed to load or parse OpenAPI spec.`, error);
        console.error(`[Boot] Proxy will still start, but mock generation will fail until the spec is fixed.`);
    }

    // Force bind to IPv4 to prevent Windows localhost routing issues
    app.listen(Number(config.PORT), '0.0.0.0', () => {
        console.log(`[Boot] 🚀 Ghost-Environment Proxy is LIVE on [http://127.0.0.1](http://127.0.0.1):${config.PORT}`);
    });
}

bootstrap().catch(err => {
    console.error('[Boot] FATAL ERROR during startup:', err);
});
