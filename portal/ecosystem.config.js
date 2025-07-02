module.exports = {
    apps: [
        {
            name: 'portalPro',
            port: '3000',
            exec_mode: 'cluster',
            instances: '4',
            script: './server/index.mjs'
        }
    ]
}
