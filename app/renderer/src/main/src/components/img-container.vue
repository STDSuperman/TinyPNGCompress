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
import { isSpecificImage, isFolder, dirExist } from '../utils/index.js';
import { Card } from 'view-design';
import { State } from 'vuex-class';
const tinify = window.require('tinify');
declare var window: any;

@Component({
	components: { Card }
})
export default class ImgContainer extends Vue {
	fs: any;
	tinify: any;
	$Message: any;
	@State apiKey: any;
	@State cacheDir: any;
	@State replaceStatus: any;
	constructor(props: any) {
		super(props);
		this.fs = window.require('fs');
	}
	$refs: {
		file: HTMLFormElement;
		container: HTMLFormElement;
	};
	handleCompressed(cacheFileDir: string, resultData: any, sourceData: any, path: string, filename: string) {
		if (this.replaceStatus) {
			// 判断缓存目录是否存在
			if (!dirExist(this.cacheDir)) {
				this.fs.mkdirSync(this.cacheDir);
			}
			this.fs.writeFileSync(cacheFileDir, sourceData); // 缓存原图
			this.fs.writeFileSync(cacheFileDir, resultData); // 缓存压缩图
		}
        this.fs.writeFileSync(path, resultData);
        const proportion = Math.ceil((resultData.length / sourceData.length) * 100);
		this.$Message.success(`压缩${filename}成功，压缩比例${proportion}%`);
	}
	readCacheImg(path: string,cacheFileDir: string, sourceData: number, filename: string) {
		return new Promise(resolve => {
			this.fs.readFile(cacheFileDir, (err: Error, resultData: any) => {
				if (err) {
					resolve(true);
					return;
                }
                this.handleCompressed(cacheFileDir, resultData, sourceData, path, filename);
				resolve(false);
			});
		});
	}
	// 上传压缩并替换原图片
	async compressImage(path: string, filename: string) {
		tinify.key = this.apiKey;
		const sourceData = this.fs.readFileSync(path);
		const pathModule = window.require('path');
		const cacheFileDir = pathModule.resolve(this.cacheDir, 'uncompress-' + filename);
		console.log(sourceData);
		this.readCacheImg(path, cacheFileDir, sourceData, filename).then(val => {
			if (val) {
				tinify.fromBuffer(sourceData).toBuffer((err: Error, resultData: BufferSource) => {
					// if (err) throw err;
					if (err instanceof tinify.ConnectionError || err instanceof tinify.ServerError) {
						console.log('compress failed.' + path + ', recompress.');
						this.compressImage(path, filename);
						return;
					} else if (err instanceof tinify.ClientError || err instanceof tinify.AccountError) {
						if (err.message.indexOf('Your monthly limit has been exceeded') >= 0) {
							/*该账户数目超过*/
							return;
						}
						return;
					}
                    console.log(resultData);
                    this.handleCompressed(cacheFileDir, resultData, sourceData, path, filename);
				});
			}
		});
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
			this.compressImage(files[i].path, files[i].name);
		}
	}
	handleFolder(path: string) {
		const pathModule = window.require('path');
		try {
			const fileList = this.fs.readdirSync(path);
			fileList.forEach((filename: string) => {
				if (isFolder(filename)) {
					this.handleFolder(pathModule.resolve(path, filename)); // 递归遍历检查所有文件
				} else {
					if (isSpecificImage(filename)) {
						this.compressImage(pathModule.resolve(path, filename), filename);
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	initDropTarget() {
		const container = this.$refs.container;
		window.addEventListener('ondragstart', (e: any) => {
			e.preventDefault();
		});
		container.addEventListener(
			'drop',
			(e: any) => {
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
							this.compressImage(path, itemList[i].name);
						}
					}
				}
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		container.addEventListener('dragover', e => {
			e.preventDefault();
			e.stopPropagation();
		});
	}
	mounted() {
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
	margin-top: 10px;
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
