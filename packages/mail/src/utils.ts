import qs from 'qs';
import urlJoin from 'url-join';
import config from '@two/config';

export function getUrl(path: string, query?: object) {
  const [url, ...parts] = urlJoin(
    config.get('urls.web', ''),
    path,
    qs.stringify(query, { addQueryPrefix: true }),
  ).split(/(\?|#)/);

  return `${url}/${parts.join('')}`;
}
