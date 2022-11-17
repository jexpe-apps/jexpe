import { IVaultIndex, IVault, Maybe } from 'src/types'

const __VAULT_MASTER_PASSWORD = 'BANANA'

const __VAULT_PERSONAL_WORKSPACE_AS_JSON = {
    id: 'default',
    display_name: 'Personal',
    description: 'Your default workspace for storing items.',
    groups: [
        {
            id: 'cl6ccsjve000009ml343sgwhe',
            display_name: 'Jexpe',
        },
    ],
    hosts: [
        {
            id: 'cla59u13n0001ac22kbnjoeo5',
            parent: 'cl6ccsjve000009ml343sgwhe',
            display_name: 'hetzner-vps-2gb',
            hostname: '167.235.67.66',
            services: [
                {
                    type: 'SSH',
                    port: 22,
                    username: 'root',
                    id_rsa: '~/.ssh/id_rsa',
                },
            ],
        },
        {
            id: 'cla5a4a4s0003ac22qxlwkk7n',
            display_name: 'ovh-vps-8gb',
            hostname: '167.235.67.66',
            services: [
                {
                    type: 'SSH',
                    port: 22,
                    username: 'root',
                    password: 'secret_password',
                },
            ],
        },
    ]
}

const __VAULT_KO2_WORKSPACE_AS_JSON = {
    id: 'cla59qbwf0000ac22jkt6ozpb',
    display_name: 'KO2',
    groups: [
        {
            id: 'cl6ccsjve000009ml343sgwhe',
            display_name: 'Saturno',
        },
    ],
    hosts: [
        {
            id: 'cla59u13n0001ac22kbnjoeo5',
            parent: 'cl6ccsjve000009ml343sgwhe',
            display_name: 'hetzner-vps-2gb',
            hostname: '167.235.67.66',
            services: [
                {
                    type: 'SSH',
                    port: 22,
                    username: 'root',
                    id_rsa: '~/.ssh/id_rsa',
                },
            ],
        },
        {
            id: 'cla5a4a4s0003ac22qxlwkk7n',
            display_name: 'ovh-vps-8gb',
            hostname: '167.235.67.66',
            services: [
                {
                    type: 'SSH',
                    port: 22,
                    username: 'root',
                    password: 'secret_password',
                },
            ],
        },
    ],
}

const __VAULT_AS_JSON = [
    {
        id: 'default',
        object: __VAULT_PERSONAL_WORKSPACE_AS_JSON,
    },
    {
        id: 'cla59qbwf0000ac22jkt6ozpb',
        object: __VAULT_KO2_WORKSPACE_AS_JSON,
    },
]

export const __UNLOCK = async (password: string) => {

    if (password !== __VAULT_MASTER_PASSWORD) {
        throw Error('Invalid password.')
    }

    return __VAULT_AS_JSON as IVaultIndex
}

export const __LOAD_VAULT = async (id: string) => {
    return __VAULT_AS_JSON
        .find((x) => x.id === id)!.object as IVault
}