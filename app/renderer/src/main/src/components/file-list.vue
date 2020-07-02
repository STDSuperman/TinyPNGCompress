<template>
   <div class="file-list">
       <div class="container">
            <CellGroup>
                <Cell title="测试文件">
                    <Spin fix slot="extra">
                        <!-- <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon> -->
                        <Icon type="ios-checkmark" size=30></Icon>
                    </Spin>
                </Cell>
            </CellGroup>
       </div>
   </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { Cell, Icon, CellGroup, Spin } from 'view-design';

@Component({
    components: {
        Cell,
        Icon,
        CellGroup,
        Spin,
    }
})
export default class FileList extends Vue {

}

</script>

<style lang='scss'>
.file-list{
    .container{
        text-align: left;
        .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
        .demo-spin-col{
            height: 100px;
            position: relative;
        }
    }
}
</style>