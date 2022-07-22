import { resolve } from 'path'
import FastpackPluginLessLoader from '@weblif/plugin-less-loader'
import ESLintPlugin from 'eslint-webpack-plugin'
import { getFastpackConfig } from '@weblif/fastpack'

/**
 * 扩展 Webpack 的信息
 */
class WebpackChainPlugin {
    after(webpack: any) {
        webpack.plugin('fastpack/ESLintPlugin').use(ESLintPlugin, [{
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        }])
    }
}

export default getFastpackConfig({
    title: 'test',
    router: {
        paths: [
            '/'
        ],
        notFound: '/components/NotFound',
        loading: '/components/Loading',
        layout: '/layouts'
    },
    plugins: [
        new FastpackPluginLessLoader({}),
        new WebpackChainPlugin()
    ]
})
