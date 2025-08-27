# @two/mail

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Development

The mail package is structured as a producer/consumer queue. The producer is intended to be bundled with other packages (e.g. API) and enables writing to the mail queue directly without worrying about email sending implementation or completion. The consumer application runs separately in its own container, processing items in the queue and sending the actual emails.

Assuming you've previously followed the commands in the root [README](../../README.md), fire up the mail application for development by running the following commands from the monorepo root:

```shell
# Build containers
docker-compose build

# Start containers
docker-compose up
```

As usual, your local files are mounted as a volume, so you can modify code, styles, and templates directly and the running mail container will be updated immediately. By default, emails sent in development mode will appear in the Mailhog interface: `http://localhost:8025` by default.

## Configuration

As usual, the development environment should work out of the box with no additional configuration required, but some secrets may be required for production and staging environments (or for testing particular integrations).

### Environment Variables

| Environment Var Name | Config Name            | Description                   | Default     | Notes                                              |
| -------------------- | ---------------------- | ----------------------------- | ----------- | -------------------------------------------------- |
| `MAIL_QUEUE_URL`     | `mail.queue.url`       | SQS mail queue URL            |             | **Required.** Generated during AWS deployment.     |
| `SENDGRID_API_KEY`   | `mail.sendgrid.apiKey` | SendGrid API key              |             | **Required.** Use AWS secrets script to configure. |
| `MAIL_SMTP_HOST`     | `mail.smtp.host`       | Hostname for STMP connections | `localhost` | Development only (nodemailer -> Mailhog)           |
| `MAIL_SMTP_PORT`     | `mail.smtp.port`       | Port for SMTP connections     | `1025`      | Development only (nodemailer -> Mailhog)           |

Also check the config package [README](../config/README.md) for environment variables available in the global config.

## Testing

To run all tests and get coverage reports, simply run `yarn workspace @two/mail test`.
