"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowtlyApi = void 0;
class FlowtlyApi {
    constructor() {
        this.name = 'flowtlyApi';
        this.displayName = 'Flowtly API';
        this.documentationUrl = 'https://app.flowtly.com';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
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
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.token}}',
                },
            },
        };
    }
}
exports.FlowtlyApi = FlowtlyApi;
//# sourceMappingURL=FlowtlyApi.credentials.js.map