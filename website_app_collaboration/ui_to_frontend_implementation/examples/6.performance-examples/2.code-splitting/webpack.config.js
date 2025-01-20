const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 环境变量 / Environment variables
const isProduction = process.env.NODE_ENV === 'production';
const shouldAnalyze = process.env.ANALYZE === 'true';

// 基础配置 / Base configuration
const config = {
    // 入口配置 / Entry configuration
    entry: {
        main: './src/index.js',
        // 公共依赖入口 / Common dependencies entry
        vendor: ['react', 'react-dom', 'react-router-dom']
    },

    // 输出配置 / Output configuration
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 
            'js/[name].[contenthash].js' : 
            'js/[name].js',
        chunkFilename: isProduction ?
            'js/[name].[contenthash].chunk.js' :
            'js/[name].chunk.js',
        publicPath: '/',
        clean: true
    },

    // 模块配置 / Module configuration
    module: {
        rules: [
            // JavaScript/React 处理 / JavaScript/React processing
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                corejs: 3
                            }],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },

            // CSS 处理 / CSS processing
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },

            // 图片处理 / Image processing
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                },
                generator: {
                    filename: 'images/[name].[hash][ext]'
                }
            },

            // 字体处理 / Font processing
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]'
                }
            }
        ]
    },

    // 解析配置 / Resolve configuration
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@utils': path.resolve(__dirname, 'src/utils')
        }
    },

    // 优化配置 / Optimization configuration
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: isProduction
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 70000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];
                        return `vendor.${packageName.replace('@', '')}`;
                    }
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },

    // 插件配置 / Plugin configuration
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: true,
            minify: isProduction ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            } : false
        }),
        new MiniCssExtractPlugin({
            filename: isProduction ?
                'css/[name].[contenthash].css' :
                'css/[name].css',
            chunkFilename: isProduction ?
                'css/[name].[contenthash].chunk.css' :
                'css/[name].chunk.css'
        })
    ],

    // 开发服务器配置 / Development server configuration
    devServer: {
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 3000,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        },
        static: {
            directory: path.join(__dirname, 'public')
        }
    },

    // Source map 配置 / Source map configuration
    devtool: isProduction ? 'source-map' : 'eval-source-map'
};

// 生产环境特定配置 / Production-specific configuration
if (isProduction) {
    config.plugins.push(
        new webpack.ids.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    );
}

// 分析模式配置 / Analysis mode configuration
if (shouldAnalyze) {
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true
        })
    );
}

module.exports = config; 