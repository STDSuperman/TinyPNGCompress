<template>
	<div class="img-container">
		<Card style="width:98%;height: 250px">
			<div style="text-align:center">
				<div class="drop-area" @click="selectFile" ref="container">
					<input type="file" class="img-select" ref="file" multiple @change="fileChange" accept="image/*" />
					<div class="hint-area">
						<img src="../assets/upload.png" alt class="upload-icon" />
						<p>请拖拽PNG/JPG文件（支持文件夹）到这里哦！</p>
					</div>
				</div>
			</div>
		</Card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isSpecificImage, isFolder, dirExist, caculateFileHash } from '../utils/index.js';
// import { start } from '../utils/compress.js';
import { Card } from 'view-design';
import { State, Mutation } from 'vuex-class';
const tinify = window.require('tinify');
const pathModule = window.require('path');
const fs = window.require('fs');
declare var window: any;

@Component({
	components: { Card },
	watch: {
		cacheDir(val) {
			// @ts-ignore
			val && this.init();
		}
	}
})
export default class ImgContainer extends Vue {
	fs: any;
	tinify: any;
	$Message: any;
	@State apiKey: string;
	@State cacheDir: string;
	@State replaceStatus: any;
	@State cacheStatus: any;
	@Mutation ADD_FILE_INFO: any;
	@Mutation CHANGE_FILE_INFO: any;
	cacheCompressedDir: string; // 压缩图目录
	cacheOriginaldDir:string; // 原图目录
	constructor(props: any) {
		super(props);
	}
	$refs: {
		file: HTMLFormElement;
		container: HTMLFormElement;
	};
	init() {
		if (!this.cacheDir) return;
		// 判断缓存目录是否存在
		if (!dirExist(this.cacheDir)) {
			fs.mkdirSync(this.cacheDir);
		}
		this.cacheCompressedDir = pathModule.resolve(this.cacheDir, 'compressed-picture'); // 创建压缩完的文件缓存目录
		this.cacheOriginaldDir = pathModule.resolve(this.cacheDir, 'original-picture'); // 创建压缩文件原图的文件目录
		!dirExist(this.cacheCompressedDir) && fs.mkdirSync(this.cacheCompressedDir);
		!dirExist(this.cacheOriginaldDir) && fs.mkdirSync(this.cacheOriginaldDir);
	}
	// 拿到压缩结果进行一系列处理
	handleCompressed(resultData: any, sourceData: any, path: string, fileInfo: any, currentFileInfo: any) {
		const { name, ext } = fileInfo;
		if (this.cacheStatus) {
			const currentHash = caculateFileHash(resultData);
			let compressedPicPath, originalPicPath;
			const setCacheDirPath = () => {
				compressedPicPath = pathModule.resolve(this.cacheCompressedDir, currentHash + ext); // 压缩图缓存路径
				originalPicPath = pathModule.resolve(this.cacheOriginaldDir, name + '-tiny-' + currentHash + ext); // 原图缓存路径
			}
			setCacheDirPath();
			if (!dirExist(originalPicPath) || !dirExist(compressedPicPath)) {
				this.init();
				setCacheDirPath();
			}
			currentFileInfo.originalPicPath = originalPicPath;
			fs.writeFileSync(originalPicPath, sourceData, {encoding: 'binary'}); // 缓存原图
			fs.writeFileSync(compressedPicPath, resultData, {encoding: 'binary'}); // 缓存压缩图
		} else {
			currentFileInfo.originalPicPath = null; // 未开启缓存则置为空
		}
		if (this.replaceStatus) {
			fs.writeFileSync(path, resultData, {encoding: 'binary'}); // 替换目标图
		} else {
			fs.writeFileSync(path.replace(/\./g, '') + '-tiny-' + ext, resultData, {encoding: 'binary'}); // 在目标图位置放置图片
		}
		const proportion = Math.ceil(((sourceData.length - resultData.length) / sourceData.length) * 100);
		const reduceSize = sourceData.length - resultData.length;
		currentFileInfo.status = 1;
		currentFileInfo.reduceSize = reduceSize;
		currentFileInfo.message = `- ${reduceSize / 1000} k（${-proportion}%）`;
		currentFileInfo.sourceDataBuffer = resultData.toString('base64');
		currentFileInfo.isRestore = false;
		this.CHANGE_FILE_INFO(currentFileInfo);
		// this.$Message.success(`压缩${ base }成功，减少尺寸${ reduceSize }`);
	}
	checkCache(hash: string) {
		const fileList = fs.readdirSync(this.cacheCompressedDir);
		const filename = fileList.find((filename: string) => {
			const { name } = pathModule.parse(filename);
			if (name === hash) {
				return filename
			}
		});
		if (filename) { 
			const cacheFilePath = pathModule.resolve(this.cacheCompressedDir, filename)
			return { isCache: true, cacheFilePath }
		}
		return { isCache: false };
	}
	// 上传压缩并替换原图片
	compressImage(path: string, retryIndex: number = -1) {
		tinify.key = this.apiKey;
		const sourceData = fs.readFileSync(path);
		const fileInfo = pathModule.parse(path);
		const hash = caculateFileHash(sourceData);
		const { name, ext } = fileInfo;
		const originalPicPath = pathModule.resolve(this.cacheOriginaldDir, name + '-tiny-' + hash + ext); // 原图缓存路径
		let isCache = false;
		if (this.cacheStatus) {
			isCache = this.checkCache(hash).isCache;
		}
		console.log(originalPicPath);
		let currentFilePos = retryIndex; // 当前压缩任务在压缩列表中的索引
		// 添加当前压缩任务到任务列表中,如果是重新压缩失败项则不初始化
		retryIndex === -1 && this.ADD_FILE_INFO({
			fileInfo: {
				filename: fileInfo.base,
				isCache: isCache,
				sourceDataBuffer: sourceData.toString('base64'),
				message: isCache && "命中缓存（请勿重复压缩）",
				path,
				originalPicPath
			},
			// 获取当前压缩文件任务在fileList中的索引，用于修改异步状态
			cb: (index: number) => {
				currentFilePos = index;
			}
		});
		// 如果用户关闭了缓存模式则直接退出,返回缓存
		if (!isCache) {
			let currentFileInfo: any = { currentFilePos};
			const getCompressedImg = () => {
				return new Promise((resolve) => {
                    // 使用https请求方式压缩
					// start(path).then((resData: SourceBuffer) => {
					// 	this.handleCompressed(resData, sourceData, path, fileInfo, currentFileInfo);
					// });
					// resolve();
                    // return;
                    
					//使用API方式压缩
					tinify.fromBuffer(sourceData).toBuffer((err: any, resultData: BufferSource) => {
						if (err) {
							this.handleError(err, currentFileInfo);
							currentFileInfo.status = 2; // 0: 压缩中,1: 压缩成功,2: 错误
							this.CHANGE_FILE_INFO(currentFileInfo);
						} else {
							this.handleCompressed(resultData, sourceData, path, fileInfo, currentFileInfo);
						}
						resolve();
					});
				})
			}
			this.setTimeoutError(getCompressedImg, () => {
				this.handleError({message: "压缩超时"}, currentFileInfo);
				currentFileInfo.status = 2; // 0: 压缩中,1: 压缩成功,2: 错误
				this.CHANGE_FILE_INFO(currentFileInfo);
			})
		}
	}
	// 超时函数
	setTimeoutError(func: Function, cb: Function) {
		const timeoutFunc = () => {
			return new Promise((resolve ,reject) => {
				setTimeout(() => {
					reject();
				}, 60 * 1000)
			})
		};
		Promise.race([timeoutFunc(), func()]).catch(() => cb());
	}
	handleError(err: any, currentFileInfo: any) {
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
		this.CHANGE_FILE_INFO(currentFileInfo);
	}
	selectFile() {
		if (!this.apiKey) {
			this.$Message.warning('请先填入API KEY');
			return;
		}
		this.$refs.file.click();
	}
	async fileChange(e: any) {
		const files = e.target.files;
		if (files.length <= 0) {
			return;
		}
		for (let i = 0; i < files.length; i++) {
			this.compressImage(files[i].path);
		}
		this.$refs.file.value = '';
		this.$Message.success('压缩任务已添加');
	}
	handleFolder(path: string) {
		try {
			const fileList = fs.readdirSync(path);
			fileList.forEach((filename: string) => {
				if (isFolder(filename)) {
					this.handleFolder(pathModule.resolve(path, filename)); // 递归遍历检查所有文件
				} else {
					if (isSpecificImage(filename)) {
						this.compressImage(pathModule.resolve(path, filename));
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	initDropTarget() {
		const cardContainer:any = document.getElementsByClassName('ivu-card')[0];
		const container = this.$refs.container;
		window.addEventListener('ondragstart', (e: any) => {
			e.preventDefault();
		});
		container.addEventListener('drop', (e: any) => {
				cardContainer.classList.remove('card-hover');
				if (!this.apiKey) {
					this.$Message.warning('请先填入API KEY');
					return;
				}
				const itemList = e.dataTransfer.files;
				for (let i = 0; i < itemList.length; i++) {
					const path = itemList[i].path;
					if (isFolder(path)) {
						//文件夹类型
						this.handleFolder(path);
					} else {
						if (isSpecificImage(path)) {
							this.compressImage(path);
						}
					}
				}
				this.$Message.success('压缩任务已添加');
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);
		const dragEnterHandler = (e: any) => {
			cardContainer.classList.add('card-hover');
			e.preventDefault();
			e.stopPropagation();
		}
		const dragLeaveHandler = (e: any) => {
			cardContainer.classList.remove('card-hover');
			e.preventDefault();
			e.stopPropagation();
		}

		container.addEventListener('dragover', dragEnterHandler);
		container.addEventListener('dragleave', dragLeaveHandler);
		// this.$on('hook:destroyed',() => {
		// 	container.removeventListener('dragover', dragEnterHandler);
		// 	container.removeventListener('dragleave', dragLeaveHandler);
		// })
	}
	mounted() {
		// 重新压缩失败项
		this.$root.$on('retryCompress', (path: string, retryIndex: number) => {
			this.compressImage(path, retryIndex)
		})
		this.init();
		this.initDropTarget();
	}
}
</script>

<style lang="scss" scoped>
* {
	user-select: none;
	-webkit-user-drag: none;
}
.img-container {
	display: flex;
	justify-content: center;
	// margin-top: 10px;
	.drop-area {
		position: relative;
		width: 100%;
		height: 195px;
		border-radius: 10px;
		border: 1px dashed #ffe0ac;
		margin: 10px auto;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		img {
			width: 50px;
		}
		p {
			width: 100%;
			height: 20px;
		}
		.img-select {
			display: none;
		}
	}
}
</style>

<style lang="scss">
.card-hover{
	box-shadow: 0 1px 6px rgba(0,0,0,.2);
	border-color: #eee;
}
</style>