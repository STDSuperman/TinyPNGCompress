<template>
    <div class="file-list">
        <!-- <Poptip trigger="hover" title="爱心小贴士" content="点击可查看任务详情哦" style="margin:10px;width:100%;">
            <Button @click="openModel" type="info" long icon="md-bulb" size='large'>{{btnText}}</Button>
        </Poptip> -->
        <Button @click="openModel" style="margin:10px;" type="info" long icon="md-bulb" size='large'>{{btnText}}</Button>
        <Modal v-model="showModel" width="360">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <Icon type="ios-inforremation-circle"></Icon>
                <span>任务列表</span>
            </p>
            <div class="task-list" v-if="fileList.length">
                <Card style="width:98%;height: 78px;margin: 10px 0;" v-for="(item, index) in fileList" :key="index">
                    <div class="task-item">
                            <div class="left">
                                <img :src="getUrl(item)" alt="" srcset="" class="cover">
                                <div class="msg-box">
                                    <div class="filename">{{item.filename}}</div>
                                    <div class="desc">{{item.message || 'loading...'}}</div>
                                </div>
                            </div>
                            <div class="right">
                                <Spin fix>
                                    <Icon
                                        v-if="checkIsShowLoading(item)"
                                        type="ios-loading"
                                        size="18"
                                        class="demo-spin-icon-load"
                                    ></Icon>
                                    <section v-else>
                                        <Icon v-if="item.isCache || item.status === 1" type="ios-checkmark" size="30"></Icon>
                                        <Icon v-else type="ios-close" color='#ed4014' size="30"></Icon>
                                    </section>
                                </Spin>
                            </div>
                    </div>
                </Card>
                    <!-- <CellGroup>
                        <Cell v-for="(item, index) in fileList" :title="item.filename" :key="index">
                            <Spin fix slot="extra">
                                <Icon
                                    v-if="checkIsShowLoading(item)"
                                    type="ios-loading"
                                    size="18"
                                    class="demo-spin-icon-load"
                                ></Icon>
                                <Icon v-else type="ios-checkmark" size="30"></Icon>
                            </Spin>
                        </Cell>
                    </CellGroup> -->
            </div>
            <div class="empty" v-else>
                <Icon type="logo-octocat" class="icon"/>
                <p>空空如也</p>
            </div>
            <div slot="footer">
                <Button :disabled='!needRetryErrorItem' type="warning" size="large" long @click="retryAllError">重新压缩所有失败项</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { Cell, Icon, CellGroup, Spin, Card, Button, Poptip } from "view-design";
import { State, Mutation } from "vuex-class";
declare var require: any;

@Component({
    components: {
        Cell, Icon, CellGroup, Spin, Card, Button, Poptip
    }
})
export default class FileList extends Vue {
    @State fileList: Array<object>;
    @State failMap: Object;
    @Mutation CHANGE_FILE_INFO: any;
    showModel: boolean = false;
    get btnText() {
        if (this.fileList.length) {
            let allReduceSize = 0;
            this.fileList.forEach((item: any) => {
                if (!item.reduceSize) return;
                allReduceSize += item.reduceSize;
            })
            return `${this.fileList.length} 个压缩任务` + (allReduceSize ? `节省 ${allReduceSize} k` : '');
        }
        return '暂无压缩任务';
    }
    get needRetryErrorItem() {
        return Object.keys(this.failMap).length;
    }
    checkIsShowLoading(item: any) {
        return !item.isCache && !item.status;
    }
    retryAllError() {
        const failList = Object.keys(this.failMap);
        failList.forEach((key: any) => {
            const item: any = this.fileList[key];
            if (item.status === 2) {
                this.CHANGE_FILE_INFO({status: 0, message: null, url: null, isCache: false, currentFilePos: key}); // 重新初始化需要压缩的项
                this.$root.$emit('retryCompress', item.path, key)
            }
        })
    }
    openModel() {
        this.showModel = true;
    }
    getUrl(item: any) {
        if (item.url) {
            return item.url && 'data:image/png;base64,' + item.url;
        } else {
            return require("../assets/logo.png")
        }
    }
}
</script>

<style lang='scss'>
.file-list {
    display: flex;
    justify-content: center;
}
.ivu-poptip-rel{
    width: 100%;
}
.task-list {
    max-height: 271px;
    overflow: auto;
    text-align: left;
    .task-item{
        display: flex;
        justify-content: space-between;
        position: relative;
        .left {
            width: 80%;
            height: 100%;
            display: flex;
            align-items: center;
            // border: solid 1px #fff;
            .cover{
                display: inline-block;
                height: 45px;
                width: 45px;
                border-radius: 5px;
                // border: solid 1px #fff;
                margin-left: 2px;
                object-fit: contain;
            }
            .msg-box{
                width: calc(100% - 60px);
                height: 45px;
                margin-left: 10px;
                // border: solid 1px #fff;
                .filename{
                    // border: solid 1px #fff;
                    height: 25px;
                    width: 100%;
                    text-overflow: ellipsis;
                    // display: -webkit-box;
                    // -webkit-box-orient: vertical;
                    // -webkit-line-clamp: 2;
                    overflow: hidden;
                    font-size: 15px;
                    color: #17233d;
                    white-space: nowrap;
                    line-height: 25px;
                }
                .desc{
                    height: 15px;
                    width: 100%;
                    // border: solid 1px #fff;
                    margin-top: 4px;
                    font-size: 12px;
                    color: #515a6e;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    line-height: 15px;
                }
            }
        }
        .right {
            width: 18%;
            // border: solid 1px #fff;
            // height: 100%;
            position: relative;
        }
    }
    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background-color: skyblue;
        background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
        );
    }
    &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #ededed;
        border-radius: 10px;
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .demo-spin-col {
        height: 100px;
        position: relative;
    }
}
.empty{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    height: 100px;
    color: #aaa;
    .icon{
        font-size: 24px;
    }
    p{
        text-anchor: center;
        font-size: 17px;
    }
}
</style>