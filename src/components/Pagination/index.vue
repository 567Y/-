<template>
    <div class="pagination">
        <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
        <button v-if="startNumAndEndNum.start > 1"  @click="$emit('getPageNo',1)" 
            :class="{active : pageNo == 1}">1</button>
        <button v-if="startNumAndEndNum.start > 2">···</button>

        <button @click="$emit('getPageNo',page)" 
        v-for="(page,index) in startNumAndEndNum.end" :key="index"
         v-if="page>=startNumAndEndNum.start" :class="{active : page == pageNo}">{{ page }} </button>

        <button v-if="startNumAndEndNum.end < totalPage-1">···</button>
        <button v-if="startNumAndEndNum.end < totalPage" 
        @click="$emit('getPageNo',totalPage)"
        :class="{active:pageNo == totalPage}">{{ totalPage }}</button>
        <button :disabled="startNumAndEndNum.end == totalPage" @click="$emit('getPageNo',pageNo+1)">下一页</button>
        <button style="margin-left: 30px">共 {{ total }} 条</button>
       <!-- <h1> {{startNumAndEndNum }} --- 当前页码{{ this.pageNo }}</h1> -->
    </div>
</template>
<script>
export default {
    name: "Pagination",
    //  pageNo:当前第几页
    //  pageSize：每页显示多少条数据
    //  total：总共多少条数据
    //  continues：连续显示几个页码
    props:["pageNo","total","pageSize","continues"],
    computed:{
        //一共多少页
        totalPage(){
            return Math.ceil(this.total / this.pageSize)
        },
        startNumAndEndNum(){
            // 计算开始和结束的页码
            let start = 0, end = 0;
            //不正常现象:连续页码数 大于 总页数
            if (this.continues > this.totalPage) {
                start = 1;
                end = this.totalPage;    
            }else{
                //正常现象
                //起始数字 = 当前页码数 - 连续页码数的一半(向下取整)
                start = this.pageNo - Math.floor(this.continues / 2);
                //结束数字 = 当前页码数 + 连续页码数的一半(向下取整)
                end = this.pageNo + Math.floor(this.continues / 2);
                //如果当前页数是1、2 start会减2 所以会出现start小于0的问题
                if(start < 1){
                    start = 1;
                    end = this.continues;
                }
                //如果当前页数是最后两页，end会加2 所以会出现end大于总页数的问题
                if(end > this.totalPage){
                    end = this.totalPage;
                    start = this.totalPage - this.continues + 1;
                }

            }
            return {start,end};
    }
}
}
</script>
<style lang="less" scoped>
.active{
    background-color: skyblue;
}
.pagination {
    text-align: center;
    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
</style>
    
