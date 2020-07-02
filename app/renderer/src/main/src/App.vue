<template>
    <div id="app">
        <ImgContainer />
        <Divider orientation="left">配置项</Divider>
        <UserConfig/>
        <Divider orientation="left">文件列表</Divider>
        <FileList />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImgContainer from "./components/img-container.vue";
import UserConfig from './components/user-config.vue'
import FileList from './components/file-list.vue';
import { Divider } from 'view-design'

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
    height: 100vh;
    margin: 0 auto;
    overflow: hidden;
    padding: 0;
}
body{
    margin: 0px;
}
</style>
