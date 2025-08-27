/* eslint-disable camelcase */
import { Knex } from 'knex';
import { License, RelativeExperience } from '@two/shared';

const months: { [key: string]: string } = {
  January: '1',
  February: '2',
  March: '3',
  April: '4',
  May: '5',
  June: '6',
  July: '7',
  August: '8',
  September: '9',
  October: '10',
  November: '11',
  December: '12',
};

const isNumber = (value: string) => /^\d+$/.test(value);

const getUpdatedData = ({
  relativeExperience,
  license,
}: {
  relativeExperience: RelativeExperience[];
  license: License[];
}) => ({
  ...(relativeExperience && {
    relative_experience: relativeExperience.map((el) => ({
      ...el,
      startAtMonth: isNumber(el.startAtMonth) ? el.startAtMonth : months[el.startAtMonth],
      ...(el.endAtMonth && {
        endAtMonth: isNumber(el.endAtMonth) ? el.endAtMonth : months[el.endAtMonth],
      }),
    })),
  }),
  ...(license && {
    license: license.map((el) => ({
      ...el,
      issueAtMonth: isNumber(el.issueAtMonth) ? el.issueAtMonth : months[el.issueAtMonth],
      ...(el.expirationAtMonth && {
        expirationAtMonth: isNumber(el.expirationAtMonth)
          ? el.expirationAtMonth
          : months[el.expirationAtMonth],
      }),
    })),
  }),
});

export async function up(knex: Knex) {
  const allClients = await knex('clients');
  const clients = allClients.filter((client) => {
    const isRelativeExperienceInvalid = client.relative_experience?.some(
      (el: RelativeExperience) =>
        !isNumber(el.startAtMonth) || (el.endAtMonth && !isNumber(el.endAtMonth)),
    );

    const isLicenseInvalid = client.license?.some(
      (el: License) =>
        !isNumber(el.issueAtMonth) || (el.expirationAtMonth && !isNumber(el.expirationAtMonth)),
    );

    return isRelativeExperienceInvalid || isLicenseInvalid;
  });

  const promises = clients.map(({ id, relative_experience, license }) =>
    knex('clients')
      .update(getUpdatedData({ relativeExperience: relative_experience, license }))
      .where({ id }),
  );
  await Promise.all(promises);
}

export async function down() {}
