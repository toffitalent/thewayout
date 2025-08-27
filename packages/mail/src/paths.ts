import config from '@two/config';

// Configure public path for assets
__webpack_public_path__ = `${config.get('urls.mail', '').replace(/\/$/, '')}/`;
