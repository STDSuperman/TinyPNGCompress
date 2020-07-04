<template>
    <div id="app">
        <ImgContainer />
        <Divider orientation="left">配置项</Divider>
        <UserConfig />
        <Divider orientation="left">任务列表</Divider>
        <FileList />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImgContainer from "./components/img-container.vue";
import UserConfig from "./components/user-config.vue";
import FileList from "./components/file-list.vue";
import { Divider } from "view-design";

@Component({
    components: {
        ImgContainer,
        UserConfig,
        Divider,
        FileList
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0;
    margin-top: 60px;
    width: 100%;
    height: 600px;
    margin: 0 auto;
    overflow: hidden;
    padding: 0;
    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
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
}
body {
    margin: 0px;
}
</style>
