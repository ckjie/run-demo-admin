<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <img src="@/assets/images/logo.png" class="user-avatar">
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showPswDialog = true">修改密码</el-dropdown-item>
          <!-- <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :visible.sync="showPswDialog"
      width="30%"
      append-to-body
      center
      @close="closePswDialog"
    >
      <div slot="title">
        <div class="YTitle text-align-left">修改密码</div>
      </div>
      <div v-loading="dialogLoading">
        <el-form ref="pswForm" :model="form" :rules="rules" inline label-width="100px" class="psw-form">
          <el-form-item label="旧密码：" prop="oldPsw">
            <el-input v-model="form.oldPsw" size="small" placeholder="请输入旧密码" />
          </el-form-item>
          <el-form-item label="新密码：" prop="psw">
            <el-input v-model="form.psw" size="small" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="psw2">
            <el-input v-model="form.psw2" size="small" placeholder="再次输入密码" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" @click="showPswDialog = false">取消</el-button>
        <el-button type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },

  data() {
    const oldPswRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入旧密码'))
      } else if (value.length < 6) {
        callback(new Error('密码格式有误'))
      } else {
        callback()
      }
    }
    const pswRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const psw2Rule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }

    return {
      showPswDialog: false,
      dialogLoading: false,
      form: {
        oldPsw: '',
        psw: '',
        psw2: ''
      },
      rules: {
        oldPsw: [
          { required: true, validator: oldPswRule, trigger: 'blur' }
        ],
        psw: [
          { required: true, validator: pswRule, trigger: 'blur' }
        ],
        psw2: [
          { required: true, validator: psw2Rule, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    closePswDialog() {
      this.$refs.pswForm.resetFields()
      console.log('closePswDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    padding-right: 30px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          width: 40px;
          height: 40px;
          margin-right: 5px;
        }
      }
    }
  }
}

.psw-form {
  text-align: center;
}
</style>
