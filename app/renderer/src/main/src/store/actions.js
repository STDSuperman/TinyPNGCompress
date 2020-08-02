const { ipcRenderer } = window.require('electron');
import * as mutations from './mutations';
import { caculateFileHash } from '../utils/index.js';
const tinify = window.require('tinify');
const pathModule = window.require('path');
const fs = window.require('fs');

const checkCache = (hash, state) => {
	const fileList = fs.readdirSync(state.cacheCompressedDir);
	const filename = fileList.find((filename) => {
		const { name } = pathModule.parse(filename);
		if (name === hash) {
			return filename
		}
	});
	if (filename) { 
		const cacheFilePath = pathModule.resolve(state.cacheCompressedDir, filename)
		return { isCache: true, cacheFilePath }
	}
	return { isCache: false };
}
// 超时函数
const setTimeoutError = (func, cb) => {
	const timeoutFunc = () => {
		return new Promise((resolve ,reject) => {
			setTimeout(() => {
				reject();
			}, 60 * 1000)
		})
	};
	Promise.race([timeoutFunc(), func()]).catch(() => cb());
}
const handleError = (err, currentFileInfo, commit) => {
	if (err.message && err.message.indexOf('Image could not be decoded') !== -1) {
		// this.$Message.error('该图片无法被解析');
		currentFileInfo.message = '格式无法解析';
	}
	if (err instanceof tinify.ConnectionError || err instanceof tinify.ServerError) {
		currentFileInfo.message = '压缩失败'
	} else if (err instanceof tinify.ClientError || err instanceof tinify.AccountError) {
		if (err.message.indexOf('Your monthly limit has been exceeded') >= 0) {
			/*该账户数目超过*/
			// this.$Message.error('今日图片压缩次数已用尽！');
			currentFileInfo.message = '今日压缩次数达到上限'
		}
	} else {
		currentFileInfo.message = err.message;
	}
	currentFileInfo.status = 2; // 0: 压缩中,1: 压缩成功,2: 错误
	commit(mutations.CHANGE_FILE_INFO, currentFileInfo)
}

export const GET_USER_DATA_PATH = 'GET_USER_DATA_PATH';
export const COMPRESS_IMAGE = 'COMPRESS_IMAGE';

export default {
    // 异步获取用户储存数据的位置
    [GET_USER_DATA_PATH]({commit}) {
        ipcRenderer.on('getUserDataPath', (event, userDataPath) => {
            commit(mutations.SET_USER_DATA_PATH, userDataPath);
        })
        ipcRenderer.send('getUserDataPath');
    },
    [COMPRESS_IMAGE]({commit, state}, {path, retryIndex = -1}) {
        // 上传压缩并替换原图片
		tinify.key = state.apiKey;
		const sourceData = fs.readFileSync(path);
		console.log(path);
		const fileInfo = pathModule.parse(path);
		const hash = caculateFileHash(sourceData);
		const { name, ext } = fileInfo;
		const originalPicPath = pathModule.resolve(state.cacheOriginaldDir, name + '-tiny-' + hash + ext); // 原图缓存路径
		let isCache = false;
		if (state.cacheStatus) {
			isCache = checkCache(hash, state).isCache;
		}
		console.log(originalPicPath);
		let currentFilePos = retryIndex; // 当前压缩任务在压缩列表中的索引
		// 添加当前压缩任务到任务列表中,如果是重新压缩失败项则不初始化
		retryIndex === -1 && commit(mutations.ADD_FILE_INFO, {
			fileInfo: {
				filename: fileInfo.base,
				isCache: isCache,
				sourceDataBuffer: sourceData.toString('base64'),
				message: isCache && "命中缓存（请勿重复压缩）",
				path,
				originalPicPath
			},
			// 获取当前压缩文件任务在fileList中的索引，用于修改异步状态
			cb: (index) => {
				currentFilePos = index;
			}
		});
		// 如果用户关闭了缓存模式则直接退出,返回缓存
		if (!isCache) {
			let currentFileInfo = { currentFilePos};
			const getCompressedImg = () => {
				return new Promise((resolve) => {
					tinify.fromBuffer(sourceData).toBuffer((err, resultData) => {
						if (err) {
							handleError(err, currentFileInfo, commit);
							currentFileInfo.status = 2; // 0: 压缩中,1: 压缩成功,2: 错误
							commit(mutations.CHANGE_FILE_INFO, currentFileInfo)
						} else {
							commit(mutations.handleCompressed, { resultData, sourceData, path, fileInfo, currentFileInfo });
						}
						resolve();
					});
				})
			}
			setTimeoutError(getCompressedImg, () => {
				handleError({message: "压缩超时"}, currentFileInfo, commit);
				currentFileInfo.status = 2; // 0: 压缩中,1: 压缩成功,2: 错误
				commit(mutations.CHANGE_FILE_INFO, currentFileInfo)
			})
		}
    }
}