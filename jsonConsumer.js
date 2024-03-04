import { Consumer } from "./consumer.js";

export class JSONConsumer extends Consumer {
    async _payloadSelector(payload) {
        return JSON.parse(payload);
    }
}
