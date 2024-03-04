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
        /**
         * @type {*[]}
         */
        this.payloads = null;

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
     */
    async _run() {
        return false;
    }

    async run() {
        if (this._hasPayload())
            this.payloads = await this.#loadPayloads();

        return await this._run();
    }

    /**
     * @abstract
     */
    async _loadPayloads() {
    }
}
