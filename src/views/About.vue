<template>
    <div class="about">
        <div class="title">{{ title }}</div>
        <img :src="src" alt="">
        <button ripple class="bluebtn" @click="goBack()" style="margin-right: .2rem">返回上一页</button>
        <button ripple class="greenbtn" @click="nextPage">下一页</button>
    </div>
</template>

<script lang="ts">
import Global from '@/modules/Global';
import { Component, Vue  } from 'vue-property-decorator';
import store from '../modules/store';

@Component
export default class About extends Vue {
    
    private src = store.swiperList[0].img;

    private id: number = 0;

    private title = '空白页..';

    goBack() {
        Global.routeGoBack();
    }

    nextPage() {
        this.$router.push(`/page/${this.id}`);
        // location.reload();
    }

    mounted() {
        const id = Number(this.$route.params.id);
        this.title = '空白页-' + id;
        this.id = id + 1;
        // console.log(this.$route);
    }
}
</script>

<style lang="less">
@import "../../static/styles/base.less";

.about{
    width: 100%;
    padding: .2rem;
}
</style>