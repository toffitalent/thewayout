require('@two/config');
require('../src/config');

afterAll(async () => {
  const { app } = require('../src/app');
  const { knex } = require('../src/db');

  await knex.destroy();
  app.store().disconnect();
});

/* Serializers */

const dateFields = ['createdAt', 'updatedAt'];

expect.addSnapshotSerializer({
  key: '__JEST_DATE_SERIALIZER__',
  print(val, serialize) {
    const newVal = { ...val };

    dateFields.forEach((field) => {
      if (newVal[field]) {
        newVal[field] = '<Date>';
      }
    });

    Object.defineProperty(newVal, this.key, {
      enumerable: false,
    });

    return serialize(newVal);
  },
  test(val) {
    return (
      val &&
      typeof val === 'object' &&
      !Object.prototype.hasOwnProperty.call(val, this.key) &&
      dateFields.some((field) => Object.prototype.hasOwnProperty.call(val, field))
    );
  },
});
