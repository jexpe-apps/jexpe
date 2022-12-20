import { IVault, Maybe } from 'src/types'

const __VAULT_PERSONAL: IVault = {
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
                    port: 22,
                    username: 'root',
                    password: 'secret_password',
                },
            ],
        },
    ],
}

interface ITryMasterPasswordSuccess {
    token: string;
}

interface ITryMasterPasswordFailure {
    error: string;
}

type ITryMasterPasswordResult = ITryMasterPasswordSuccess | ITryMasterPasswordFailure

export const TRY_MASTER_PASSWORD = async (password: string): Promise<ITryMasterPasswordResult> => {
    return password != 'mela' ?
        { error: 'Wrong password.' } :
        { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJfcGFzc3dvcmQiOiJtZWxhIiwiaWF0IjoxNTE2MjM5MDIyfQ.u2TWi3rG9mGr4pF6aE3xAs1KUvTEsQFPihw6dOPG1Ow' }
}

export const GET_VAULT = async (token: string): Promise<Maybe<IVault>> => {
    return __VAULT_PERSONAL
}