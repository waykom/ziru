<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><router-link :to="this.$route.path">{{
          $route.name
        }}</router-link></el-breadcrumb-item
      >
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input type="text" v-model="searchKey.key" placeholder="请输入小区名称搜索"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-cascader
            size="large"
            :options="pcaTextArr"
            placeholder="请选择地区搜索"
            v-model="searchKey.selectedOptions">
          </el-cascader>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            @click="handleDelSearchKey"
            icon="el-icon-delete">清空
          </el-button>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-light">
            <el-button
              type="primary"
              @click="handleSearch"
              icon="el-icon-search">搜索
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="1">
        <el-button type="primary" @click="handleClickAdd">添加小区</el-button>
      </el-col>
      <el-col :span="1" :offset="20">
        <el-upload 
          class="upload-demo" 
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          action="/residence/import">
          <el-button size="mini" type="success" v-loading="uploadBtn.loading" :disabled="uploadBtn.disabled">上传</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1">
        <el-button size="mini" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>
    <el-dialog title="添加小区" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item
          label="小区名称"
          prop="name"
          :rules="[{ required: true, message: '不能为空' }]"
          class="rightText"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="所在地区"
          prop="selectedOptions"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-cascader
            size="large"
            :options="pcaTextArr"
            v-model="form.selectedOptions"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="link"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="linkPhone"
          :rules="[
            { required: true, message: '不能为空' },
            { type: 'number', message: '联系电话必须为数字值' },
          ]"
        >
          <el-input v-model.number="form.linkPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="danger" @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" @click="onSubmit(submitType, 'form')"
          >确 认</el-button
        >
      </div>
    </el-dialog>

    <el-table
      max-height="450px"
      v-loading="loading"
      :data="tableData"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="小区名称" width="200">
      </el-table-column>
      <el-table-column prop="province" label="省"> </el-table-column>
      <el-table-column prop="city" label="市"> </el-table-column>
      <el-table-column prop="area" label="区"> </el-table-column>
      <el-table-column prop="address" label="详细地址" width="250">
      </el-table-column>
      <el-table-column prop="link" label="联系人"> </el-table-column>
      <el-table-column prop="linkPhone" label="联系电话"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="primary" size="mini"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalPages"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { pcaTextArr } from "element-china-area-data";
import axios from "axios";
export default {
  data() {
    return {
      form: {
        name: "",
        address: "",
        selectedOptions: [],
        link: "",
        linkPhone: "",
        rid: null,
      },
      pcaTextArr,
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1,
      // 总数
      totalPages: 0,
      // 每页展示几条数据
      pageSize: 10,
      loading: false,
      submitType: "",
      //搜索关键字
      searchKey: {
        key:'',
        selectedOptions:[]
      },
      uploadBtn:{
        loading:false,
        disabled:false
      }
    };
  },
  mounted() {
    // console.log(this.$route);
    this.getTableData();
  },
  methods: {
    handleDelSearchKey(){
      this.searchKey.key = ''
      this.searchKey.selectedOptions = new Array()
    },
    handleExport(){
      window.open('http://localhost:8080/residence/export','_blank')
    },
    onSuccess(){
      this.uploadBtn.loading = false
      this.uploadBtn.disabled = false
      this.getTableData()
    },
    beforeUpload(){
      this.uploadBtn.loading = true
      this.uploadBtn.disabled = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClickAdd() {
      this.dialogFormVisible = true;
      this.submitType = "add";
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    onSubmit(type, formName) {
      const { name, address, link, linkPhone, rid } = this.form;
      const [province, city, area] = this.form.selectedOptions;
      if (type == "add") {
        // 添加小区
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios
              .post("/residence", {
                name,
                address,
                link,
                linkPhone,
                province,
                city,
                area,
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                  });
                  this.dialogFormVisible = false;
                  this.getTableData();
                  this.$message({
                    type: "success",
                    message: "添加成功！",
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "添加失败~",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      }
      if (type == "update") {
        // 更新小区信息
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios
              .put("/residence", {
                createTime: "",
                deleteFlag: 1,
                updateTime: null,
                province,
                city,
                area,
                name,
                address,
                link,
                linkPhone,
                rid,
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                  });
                  this.dialogFormVisible = false;
                  this.getTableData();
                  this.$message({
                    type: "success",
                    message: "更新成功！",
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "更新失败~",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      }
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      let [province,city,area] = this.searchKey.selectedOptions
      axios
        .get("/residence", {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            name: this.searchKey.key,
            province,city,area
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.totalPages = res.data.total;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error("错了哦，这是一条错误消息");
        });
    },
    handleDelete(row) {
      let { rid } = row;
      this.$confirm("此操作将永久删除该小区信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .delete(`/residence/${rid}`)
            .then((res) => {
              if (res.data.status == 200) {
                this.getTableData();
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
              } else {
                this.$message.error("错了哦，这是一条错误消息");
              }
            })
            .catch((error) => {
              this.$message.error("错了哦，这是一条错误消息");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleEdit(row) {
      this.submitType = "update";
      let { rid, name, address, link, linkPhone, province, city, area } = row;
      this.form.rid = rid;
      this.form.name = name;
      this.form.address = address;
      this.form.link = link;
      this.form.linkPhone = linkPhone * 1;
      this.form.selectedOptions = new Array();
      this.form.selectedOptions.push(province, city, area);
      this.dialogFormVisible = true;
    },
    handleSearch() {
      this.getTableData();
    },
  },
};
</script>
<style scoped>
.box .box-card{
  margin: 10px 0;
}
.box .el-table{
  margin: 10px 0;
}
.el-cascader {
  width: 100%;
}
</style>