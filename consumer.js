import { Redis } from "ioredis";

export class Consumer {
    /**
     * 
     * @param {Redis} redis 
     * @param {import('mongodb').MongoClient} mongo 
     */
    constructor(redis, mongo) {
        /**
         * @type {import('mongodb').MongoClient}
         */
        this.mongo = mongo;
        /**
         * @type {Redis}
         */
        this.redis = redis;

        this._initialize();
    }

    /**
     * @abstract
     */
    _initialize() {

    }

    /**
     * @abstract
     */
    _hasPayload() {
        return true;
    }

    /**
     * If `undefined`,
     * the payload will be excluded.
     * @param {string} payload 
     */
    async _payloadSelector(payload) {
        return payload;
    }

    async #loadPayloads() {
        const payloads = [];

        const rawPayloads = await this._loadPayloads();

        for (const rawPayload of rawPayloads)
            try {
                const payload =
                    await this._payloadSelector(
                        rawPayload
                    );

                if (payload === undefined)
                    continue;

                payloads.push(payload);
            } catch (e) {
                console.error(e);
            }

        return payloads;
    }

    /**
     * @abstract
     * @param {*[]} payloads 
     */
    async _run(payloads) {
    }

    async run() {
        if (!this._hasPayload())
            return await this._run(null);

        return await this._run(await this.#loadPayloads());
    }

    /**
     * @abstract
     */
    async _loadPayloads() {
    }
}
