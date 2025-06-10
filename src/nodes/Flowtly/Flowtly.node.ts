import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';

export class Flowtly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Flowtly',
		name: 'flowtly',
		icon: 'file:./flowtly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Flowtly API',
		defaults: {
			name: 'Flowtly',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'flowtlyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://app.flowtly.com/api',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Auth',
						value: 'auth',
					},
				],
				default: 'organization',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['organization'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all organizations',
						action: 'Get all organizations',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['auth'],
					},
				},
				options: [
					{
						name: 'Login',
						value: 'login',
						description: 'Login to get JWT token',
						action: 'Login to get JWT token',
					},
				],
				default: 'login',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['auth'],
						operation: ['login'],
					},
				},
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['auth'],
						operation: ['login'],
					},
				},
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						resource: ['organization'],
					},
				},
			},
			{
				displayName: 'Items Per Page',
				name: 'itemsPerPage',
				type: 'number',
				default: 10,
				description: 'Number of items per page',
				displayOptions: {
					show: {
						operation: ['getAll'],
						resource: ['organization'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'auth') {
					if (operation === 'login') {
						const username = this.getNodeParameter('username', i) as string;
						const password = this.getNodeParameter('password', i) as string;

						const response = await this.helpers.request({
							method: 'POST',
							url: 'https://app.flowtly.com/api/login',
							body: {
								username,
								password,
							},
						});

						// Parse the response if it's a string
						if (typeof response === 'string') {
							try {
								responseData = JSON.parse(response);
							} catch (e) {
								throw new NodeOperationError(this.getNode(), 'Failed to parse login response: ' + response);
							}
						} else {
							responseData = response;
						}

						// Log the response for debugging
						console.log('Login response:', JSON.stringify(responseData, null, 2));

						// Return the token in the output
						if (responseData && responseData.token) {
							returnData.push({
								json: {
									token: responseData.token,
									success: true,
									message: 'Login successful',
									response: responseData,
								},
							});
						} else {
							// Log the error response
							console.error('Login failed. Response:', JSON.stringify(responseData, null, 2));
							throw new NodeOperationError(this.getNode(), 'No token received from login response. Full response: ' + JSON.stringify(responseData));
						}
					}
				} else if (resource === 'organization') {
					if (operation === 'getAll') {
						const page = this.getNodeParameter('page', i) as number;
						const itemsPerPage = this.getNodeParameter('itemsPerPage', i) as number;

						// Try to get token from input data first
						let token: string | undefined;
						const inputData = items[i]?.json as IDataObject;
						if (inputData?.token && typeof inputData.token === 'string') {
							token = inputData.token;
						}

						// If no token in input, try to get from credentials
						if (!token) {
							const credentials = await this.getCredentials('flowtlyApi');
							token = credentials.token as string;
						}

						if (!token) {
							throw new NodeOperationError(this.getNode(), 'No token found. Please login first.');
						}

						// Log the request details
						console.log('Making organizations request with token:', token.substring(0, 20) + '...');
						console.log('Request URL:', 'https://app.flowtly.com/api/organizations');
						console.log('Request headers:', {
							'Authorization': `Bearer ${token.substring(0, 20)}...`,
						});
						console.log('Request query params:', {
							page,
							itemsPerPage,
						});

						try {
							responseData = await this.helpers.request({
								method: 'GET',
								url: 'https://app.flowtly.com/api/organizations',
								headers: {
									'Authorization': `Bearer ${token}`,
									'Accept': 'application/json'
								}
							});

							// Log the response
							console.log('Organizations response:', JSON.stringify(responseData, null, 2));

							if (responseData) {
								// Si la réponse contient hydra:member, on retourne directement ce tableau
								if (responseData['hydra:member']) {
									returnData.push({
										json: responseData['hydra:member']
									});
								} else {
									returnData.push({
										json: responseData
									});
								}
							}
						} catch (error: any) {
							console.error('Organizations request failed:', error.response?.data || error.message);
							throw new NodeOperationError(
								this.getNode(),
								`Failed to get organizations: ${error.response?.data || error.message}. Status: ${error.response?.status || 'unknown'}`
							);
						}
					}
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message || 'Unknown error occurred',
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	}
} 