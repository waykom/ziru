<template>
  <div>
    <el-container>
      <el-header>
        <h2 @click="toHome">自如租房后台管理系统</h2>
        <el-dropdown>
          <span class="el-dropdown-link">
            <div>{{ userName }}</div>
            <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
            <div><el-avatar :size="40" :src="userFace"></el-avatar></div>
          </span>
          <el-dropdown-menu slot="dropdown">  
            <el-dropdown-item>用户中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout" divided
              >Logout</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside style="width:250px">
          <el-menu
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            router
          >
            <el-menu-item :index="route.path"
              v-for="(route,index) in this.$router.options.routes[1].children"
              :key="index"
            >
              <i :class="route.meta.icon"></i>
              <span slot="title">{{route.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view v-if="this.$route.path!='/home'"></router-view>
          <h1 v-else>自如租房后台管理系统</h1>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      userName: "USERNAME",
      userFace: ""
    };
  },
  mounted() {
    let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    this.userName = userInfo.name;
    this.userFace = userInfo.userface
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear("userInfo");
      axios
        .get("/logout")
        .then((res) => {
          if (res.data.status === 200) {
            this.$router.replace("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toHome: function () {
      this.$router.push('/home')
    }
    
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 700px;
}
.el-dropdown-link{
  height: 100%;
  width: 150px;
  line-height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 100%;
}
</style>