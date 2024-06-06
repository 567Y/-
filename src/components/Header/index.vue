<template>
    <!-- 头部 -->
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>乐优购欢迎您！</p>
                    <p v-if="!userName">
                        <span>请</span>
                        <router-link to="/login">登录</router-link>
                        <router-link class="register" to="/register">免费注册</router-link>
                    </p>

                    <p v-else>
                        <a>{{ userName }}</a>
                        <a @click="UserLogOut" class="register">退出登录</a>
                    </p>
                </div>
                <div class="typeList">
                    <router-link to="/center/myorder">我的订单</router-link>
                    <router-link to="/shopcart">我的购物车</router-link>
                    <a href="###">我的乐优购</a>
                    <a href="###">乐优购会员</a>
                    <a href="###">企业采购</a>
                    <a href="###">关注乐优购</a>
                    <a href="###">合作招商</a>
                    <a href="###">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <router-link class="logo" to="/home">
                   <img src="./images/logo2.png" alt="">
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
                    <button class="sui-btn btn-xlarge btn-danger" type="button" @click="SearchCon">搜索</button>
                </form>
            </div>
        </div>
    </header>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Header',
    data() {
        return {
            keyword: ''
        }
    },
    methods: {
        //编程式路由导航: 作用：不借助<router-link> 实现路由跳转，让路由跳转更加灵活
        SearchCon() {
            // this.$router.push(`/search?keyword=${this.keyword}&id=666`)
            //合并参数 
            //这里是判断路由中是否还包含query参数 如果包含就和params参数一起传过去
            //如果不包含query参数 直接将params参数传递过去
            //query参数是TypeNav组件的三级列表所传递的参数

            //合并参数
            //这里是判断路由中是否还包含query参数 如果包含就和params参数一起传过去
            //如果不包含query参数 直接将params参数传递过去
            //params参数是三级分类的数据
            if (this.$route.query) {
                //如果有query参数 则将query参数和params参数合并起来
                let location = { name: 'search' };
                let params = { keyword: this.keyword }
                location.query = this.$route.query;
                location.params = params;
                this.$router.push(location)
            }


        },
        //退出登录
        async UserLogOut() {
            try {
                //派发action清空用户信息
                await this.$store.dispatch("clearUserInfo");
                //退出登录后跳转到home首页
                this.$router.push("/home")
            } catch (error) {
                alert(error.message)
            }

        }
    },
    mounted() {
        //清除关键字
        this.$bus.$on("clearKeyword", () => {
            // console.log(123);
            this.keyword = "";
        });
    },
    computed: {
        //判断用户在登录成功以后有没有用户名
        userName() {
            return this.$store.state.user.userInfo.loginName;
        }
    }
}
</script>

<style scoped lang="less">
.header {
    &>.top {
        background-color: #eaeaea;
        height: 30px;
        line-height: 30px;

        .container {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .loginList {
                float: left;

                p {
                    float: left;
                    margin-right: 10px;

                    .register {
                        border-left: 1px solid #b3aeae;
                        padding: 0 5px;
                        margin-left: 5px;
                    }
                }
            }

            .typeList {
                float: right;

                a {
                    padding: 0 10px;

                    &+a {
                        border-left: 1px solid #b3aeae;
                    }
                }

            }

        }
    }

    &>.bottom {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;

        .logoArea {
            float: left;

            .logo {
                img {
                    width: 175px;
                    margin: 25px 45px;
                }
            }
        }

        .searchArea {
            float: right;
            margin-top: 35px;

            .searchForm {
                overflow: hidden;

                input {
                    box-sizing: border-box;
                    width: 490px;
                    height: 32px;
                    padding: 0px 4px;
                    border: 2px solid #ea4a36;
                    float: left;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    height: 32px;
                    width: 68px;
                    background-color: #ea4a36;
                    border: none;
                    color: #fff;
                    float: left;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
}
</style>