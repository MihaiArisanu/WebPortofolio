export default {
    name: 'osFile',
    title: 'OS File / Folder',
    type: 'document',
    fields: [
        {
            name: 'nodeId',
            title: 'ID Unic (ex: 1, 2, 3... 0 e rezervat pt root)',
            type: 'number',
            validation: Rule => Rule.required()
        },
        {
            name: 'name',
            title: 'Nume (ex: bio.txt, about, me.jpg)',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'type',
            title: 'Tipul Fișierului',
            type: 'string',
            options: {
                list: [
                    { title: 'Folder', value: 'dir' },
                    { title: 'Document Text (.txt)', value: 'txt' },
                    { title: 'Imagine (.img/.jpg)', value: 'img' },
                    { title: 'Executabil (.sh/.exe)', value: 'exec' }
                ]
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'size',
            title: 'Mărime (ex: 4.0 K)',
            type: 'string',
            initialValue: '4.0 K'
        },
        {
            name: 'date',
            title: 'Data (ex: 2026-03-21)',
            type: 'string'
        },
        {
            name: 'content',
            title: 'Conținutul text (doar pentru fișiere text)',
            type: 'text',
            hidden: ({ document }) => document?.type === 'dir'
        },
        {
            name: 'parentId',
            title: 'ID Folder Părinte (-1 pt root, 0 pt folderele principale)',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'type'
        }
    }
}