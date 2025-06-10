"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flowtly = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Flowtly {
    constructor() {
        this.description = {
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
    }
    async execute() {
        var _a, _b, _c, _d;
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'auth') {
                    if (operation === 'login') {
                        const username = this.getNodeParameter('username', i);
                        const password = this.getNodeParameter('password', i);
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
                            }
                            catch (e) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to parse login response: ' + response);
                            }
                        }
                        else {
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
                        }
                        else {
                            // Log the error response
                            console.error('Login failed. Response:', JSON.stringify(responseData, null, 2));
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No token received from login response. Full response: ' + JSON.stringify(responseData));
                        }
                    }
                }
                else if (resource === 'organization') {
                    if (operation === 'getAll') {
                        const page = this.getNodeParameter('page', i);
                        const itemsPerPage = this.getNodeParameter('itemsPerPage', i);
                        // Try to get token from input data first
                        let token;
                        const inputData = (_a = items[i]) === null || _a === void 0 ? void 0 : _a.json;
                        if ((inputData === null || inputData === void 0 ? void 0 : inputData.token) && typeof inputData.token === 'string') {
                            token = inputData.token;
                        }
                        // If no token in input, try to get from credentials
                        if (!token) {
                            const credentials = await this.getCredentials('flowtlyApi');
                            token = credentials.token;
                        }
                        if (!token) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No token found. Please login first.');
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
                                }
                                else {
                                    returnData.push({
                                        json: responseData
                                    });
                                }
                            }
                        }
                        catch (error) {
                            console.error('Organizations request failed:', ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to get organizations: ${((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message}. Status: ${((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) || 'unknown'}`);
                        }
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message || 'Unknown error occurred',
                        },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.Flowtly = Flowtly;
//# sourceMappingURL=Flowtly.node.js.map