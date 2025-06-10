# Flowtly N8N Integration

This project integrates Flowtly with N8N, allowing you to automate your workflows using Flowtly's API.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Valyors/flowtly-n8n.git
   cd flowtly-n8n
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Link the package to N8N:
   ```bash
   npm link
   ```

5. Copy the built files to N8N's custom directory:
   ```bash
   cp -r dist/* ~/.n8n/custom/
   ```

## Usage

After installation, you can use Flowtly nodes in your N8N workflows. Configure the nodes with your Flowtly API credentials and start automating your processes.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
