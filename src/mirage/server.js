/* eslint-disable import/no-extraneous-dependencies */
import { createServer, Model, Factory } from "miragejs";
import { faker } from "@faker-js/faker";
import { filterTags, selectProps, sortTags } from "./utils";

export default function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      tag: Model,
    },

    factories: {
      tag: Factory.extend({
        key(i) {
          const sampleKey = faker.word.words({ count: { min: 1, max: 10 } });
          return `${sampleKey.slice(0, 127)}${i}`;
        },
        value(i) {
          const sampleValue = faker.word.words({ count: { min: 1, max: 10 } });
          return `${sampleValue.slice(0, 255)}${i}`;
        },
      }),
    },

    seeds(server) {
      server.create('tag', { key: 'vmware type', value: 'esx' });
      server.create('tag', { key: 'a', value: 'abc' });
      server.create('tag', { key: 'aa', value: 'pqr' });
      server.create('tag', { key: 'version', value: 'vmware esx 6.0' });
      server.create('tag', { key: '01234567890abcdefghijklmnopqrstuvwyz01234567890', value: 'abcdefghijklmnopqrstuvwyz01234567890abcdefghijklmnopqrstuvwyz' });
      server.createList('tag', 94);
    },

    routes() {
      this.namespace = "/data-services/v1beta1";

      this.timing = 500;

      // eslint-disable-next-line func-names
      this.get("/tags", function (schema, request) {
        const {
          select = "",
          offset = 0,
          limit = 1000,
          filter = "",
          sort = "key asc",
        } = request.queryParams;
        let processedCollection = schema.tags.all();
        if (filter.length > 0) {
          processedCollection = filterTags(processedCollection, filter);
        }

        const total = processedCollection.length;
        let { tags } = this.serialize(processedCollection);

        if (sort.length > 0) {
          tags = sortTags(tags, sort);
        }

        tags = tags.slice(Number(offset), Number(offset) + Number(limit));
        if (select.length > 0) {
          tags = selectProps(tags, select);
        }

        return {
          items: tags,
          total,
          limit: Number(limit),
          offset,
          count: tags.length,
        };
      });

      this.passthrough();

    },

  });
}
