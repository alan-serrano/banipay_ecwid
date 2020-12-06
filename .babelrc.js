const presets = [
    "@babel/preset-react",
    "@babel/preset-env"
]

const plugins = [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-async-to-generator"
]

if (process.env['COMPILER_ENV'] === 'server') {
    plugins.push(
        [
            "file-loader",
            {
                "name": "[hash].[ext]",
                "extensions": [
                    "png",
                    "jpg",
                    "jpeg",
                    "gif",
                    "svg"
                ],
                "publicPath": "/static",
                "outputPath": null
            },
            "img-file-loader-plugin"
        ],
        [
            "babel-plugin-transform-require-ignore",
            {
                "extensions": [
                    ".css",
                    ".sass",
                    ".scss"
                ]
            }
        ]
    )
}

module.exports = {
    presets,
    plugins
}