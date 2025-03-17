import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
    id: 'bunny-upload-files',
    name: 'Bunny CDN Upload Files',
    icon: 'file_present',
    description: 'Interface to receive files and send to Bunny!',
    group: 'relational',
    component: InterfaceComponent,
    options: [
        {
            field: 'folder',
            name: 'Folder',
            meta: {
                width: 'full',
                interface: 'input',
                options: {
                    placeholder: 'folder (without start/end slash)',
                },
            },
        },
        {
            field: 'collection_as_subfolder',
            name: 'Include collection name as subfolder',
            type: 'boolean',
            meta: {
                width: 'half',
                interface: 'boolean',
            },
            schema: {
                default_value: true,
            },
        }
    ],
    types: ['string'],
}); 