import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const jsonData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './package.json'), {
    encoding: 'utf8',
  })
)

export default () => {
  let config = []
  const template = function (basePath, dirname) {
    return {
      entry: basePath,
      output: {
        filename: `index.js`,
        path: path.resolve(__dirname, `dist/${dirname}`),
      },
      plugins: [
        // new MiniCssExtractPlugin({
        //   filename: 'index.css', // CSS 文件的输出名称
        // }),
        // new CleanWebpackPlugin({
        //   cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')],
        // }),
        // new HtmlWebpackPlugin({
        //   template: path.resolve(__dirname, `./src/${dirname}/index.html`), // 使用的 HTML 模板文件
        //   filename: 'index.html', // 生成的 HTML 文件名
        //   inject: false,
        // }),
        new CopyWebpackPlugin({
          patterns: [
            { from: 'src/assets/', to: '../assets' },
            // 可以添加多个文件和目标路径的配置
          ],
        }),
      ],
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
          '@': path.resolve(__dirname, './src'), // 将 @ 设置为指向 src 目录的绝对路径
        },
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /\.(less|css)$/i,
            use: [
              // MiniCssExtractPlugin.loader,
              {
                loader: 'style-loader',
                options: {
                  insert: function (element) {
                    setTimeout(() => {
                      const container = document.querySelector('gpt-container')
                      // 在这里指定样式挂载的位置
                      // element 是包含样式的 <style> 元素
                      // 可以将 element 插入到指定位置
                      // 例如使用 jQuery 将 element 插入到指定的元素中
                      container.shadowRoot.append(element)
                    })
                  },
                },
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    // file 样式文件相对配置文件的相对路径 name 样式文件名 path 样式文件所在目录的相对路径 local原始类名
                    localIdentName: `${jsonData.name}_[local]--[hash:base64:5]`,
                  },
                },
              },
              'less-loader',
            ],
          },
        ],
      },
      devtool: 'source-map',
      mode: 'development',
      devServer: {
        static: {
          directory: path.join(__dirname, './dist/content'),
        },
        open: true,
        compress: true,
        port: 9000,
      },
    }
  }
  const filePathMap = {
    content: path.resolve(__dirname, './src/content'),
    background: path.resolve(__dirname, './src/background'),
  }

  Object.keys(filePathMap).forEach((key) => {
    const result = template(filePathMap[key], key)
    config.push(result)
  })

  return config
}
