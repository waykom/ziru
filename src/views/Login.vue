<template>
  <div>
    <el-card class="box-card">
      <div>
        <h2>Login</h2>
      </div>
      <div class="inputbox">
        账号：
        <div>
          <el-input v-model="username" placeholder="请输入账号"></el-input>
        </div>
      </div>
      <div class="inputbox">
        密码：
        <div>
          <el-input
            @keydown.enter.native="login"
            type="password"
            v-model="password"
            placeholder="请输入密码"
          ></el-input>
        </div>
      </div>
      <div>
        <el-button
          v-loading="loading"
          @click="login"
          class="loginbtn"
          type="primary"
          plain
          >登录</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "Login",
  data() {
    return {
      username: "admin",
      password: "123456",
      loading: false,
    };
  },
  methods: {
    login: function () {
      this.loading = true;
      if (!this.username && !this.password) {
        this.$message.error("请输入信息");
        this.loading = false;
        return;
      }
      axios
        .post(
          "/doLogin",
          qs.stringify({
            name: this.username,
            passwd: this.password,
          })
        )
        .then((response) => {
          if (response.data.status === 200) {
            let item = window.sessionStorage.getItem("userInfo");
            if (!item) {
              window.sessionStorage.setItem(
                "userInfo",
                JSON.stringify(response.data.data)
              );
            }
            this.loading = false;
            this.$message({
              type: "success",
              message: "登录成功！",
            });
            this.$router.replace("/home");
          } else {
            this.loading = false;
            this.$message.error("错了哦，这是一条错误消息");
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.box-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);
  width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
}
.box-card h2 {
  margin-bottom: 20px;
}
.inputbox {
  display: flex;
  /* flex-direction: row; */
  justify-content: center;
  height: 50px;
  line-height: 50px;
}
.loginbtn {
  margin-top: 15px;
  margin-bottom: 15px;
  width: 58%;
}
</style>