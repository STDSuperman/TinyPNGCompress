<template>
<div class='user-config'>
    <CellGroup>
        <ICell title="原图与缓存目录">
            <Tag style="max-width: 250px;text-overflow: ellipsis;" color="primary" slot="extra" @click.native="openFileSelect">{{cacheDirShowText}}</Tag>
        </ICell>
        <ICell title="API KEY">
            <Input :value="apiKey" @on-change="setApiKey" slot="extra" @on-search='registerApiKey' search enter-button="注册" type="text" placeholder="请输入您的api key" style="width: 300px" />
        </ICell>
        <ICell title="是否替换原图">
            <ISwitch @on-change="changeReplaceStatus" slot="extra" :value='replaceStatus'/>
        </ICell>
        <ICell title="是否开启压缩与原图缓存">
            <ISwitch @on-change="changeNeedCacheStatus" slot="extra" :value='cacheStatus'/>
        </ICell>
    </CellGroup>
</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Cell,  Switch, CellGroup, Input, Upload, Button, Tag} from 'view-design';
import { State, Mutation } from 'vuex-class'

declare var window: any;
@Component({
    components: {
        ICell: Cell,
        ISwitch: Switch,
        CellGroup,
        Input,
        Upload,
        Button,
        Tag
    },
})
export default class UserConfig extends Vue {
    @State cacheDir: any;
    @State replaceStatus: any;
    @State cacheStatus: any;
    @State apiKey: any;
    @Mutation 'SET_CACHE_FOLDER': any;
    @Mutation 'SET_REPLACE_STATUS': any;
    @Mutation 'SET_API_KEY': any;
    @Mutation 'SET_CACHE_STATUS': any;
    get cacheDirShowText() {
        const path = window.require('path');
        return path.resolve('./', this.cacheDir);
    }
    changeNeedCacheStatus(val: boolean) {
        this.SET_CACHE_STATUS(val)
    }
    async openFileSelect() {
        const { remote } = window.require('electron');
        const result = await remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
        })
        const path = result.filePaths && result.filePaths[0]
        path && this.SET_CACHE_FOLDER(path)
    }
    changeReplaceStatus(val: boolean) {
        this.SET_REPLACE_STATUS(val)
    }
    registerApiKey() {
        window.open('https://tinypng.com/developers', 'Register', 'nodeIntegration=no')
    }
    setApiKey(e: any) {
        this.SET_API_KEY(e.target.value)
    }
}
</script>

<style lang='scss' scoped>
.user-config{
    padding: 0px 10px;
    text-align: left;
    .ivu-cell{
        padding: 9px 16px;
    }
    .ivu-tag-primary{
        margin-right: -1px
    }
}
</style>

<style lang="scss">
.ivu-upload-list{
    margin-top: 0!important;
}
</style>