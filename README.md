# Flowtly Connect - n8n Community Node

## Overview

Flowtly Connect is a custom n8n node that integrates with the Flowtly API. It allows you to interact with your Flowtly account directly from n8n workflows.

## Features

- 🔐 Secure authentication using username and password
- 📊 Get organization information
- 🔄 Pagination support for large datasets

## Installation

1. Install the node in your n8n instance:
```bash
npm install flowtly-connect
```

2. Restart your n8n instance

## Authentication

To use this node, you need to:
1. Have a valid Flowtly account
2. Configure the credentials in n8n using your Flowtly username and password

## Available Operations

### Organization
- Get All Organizations
  - Supports pagination
  - Returns organization details including:
    - ID
    - Name
    - Type
    - Status
    - Slug
    - Instance

## Example Usage

1. Add the Flowtly node to your workflow
2. Configure the credentials
3. Select "Organization" as the resource
4. Choose "Get All" operation
5. Configure pagination if needed
6. Execute the workflow

## Response Format

```json
{
  "@id": "/api/organizations/1hkzxrub",
  "@type": "Organization",
  "id": "1hkzxrub",
  "type": "production",
  "status": "active",
  "name": "Example Org",
  "slug": "example-org",
  "instance": "1hkzxrub"
}
```

## Support

For any issues or questions, please contact the Flowtly team at contact@flowtly.com

## License

MIT 