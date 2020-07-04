<template>
    <div class="file-list">
        <Card style="width:98%;">
            <div class="container" v-if="fileList.length">
                <CellGroup>
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
                </CellGroup>
            </div>
            <div class="empty" v-else>
                <Icon type="logo-octocat" />
                <p>空空如也</p>
            </div>
        </Card>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { Cell, Icon, CellGroup, Spin, Card } from "view-design";
import { State } from "vuex-class";

@Component({
    components: {
        Cell,
        Icon,
        CellGroup,
        Spin,
        Card
    }
})
export default class FileList extends Vue {
    @State fileList: Array<object>;
    checkIsShowLoading(item: any) {
        return !item.isCache && !item.complete;
    }
}
</script>

<style lang='scss'>
.file-list {
    display: flex;
    justify-content: center;
    .container {
        height: 65px;
        overflow: auto;
        text-align: left;
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
        p{
            font-size: 12px;
            color: #aaa;
        }
    }
}
</style>