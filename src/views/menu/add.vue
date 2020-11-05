<template>
  <div v-loading="loading" class="page">
    <el-form ref="addForm" :model="formData" :rules="rules" class="main-form" label-width="120px">
      <el-form-item label="标题 ：" prop="title">
        <el-input v-model="formData.title" maxlength="20" size="small" placeholder="请输入标题" show-word-limit />
      </el-form-item>
      <el-form-item label="头像 ：" prop="avatar">
        <el-upload
          class="pic-uploader"
          :http-request="uploadPic1"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadErr"
          :before-upload="beforeUpload"
          action
        >
          <div v-loading="avatarLoading">
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar pic-item">
            <i v-else class="el-icon-plus pic-uploader-icon" />
          </div>
          <div slot="tip" class="tip-text">（注：支持 JPG 与 PNG 格式，单张图片不可超过10M）</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述 ：" prop="content">
        <el-input v-model="formData.content" type="textarea" maxlength="200" size="small" :rows="5" placeholder="请输入描述信息" show-word-limit />
      </el-form-item>
      <el-form-item label="图片列表 ：" prop="picList">
        <el-upload
          class="pic-uploader"
          list-type="picture-card"
          :limit="9"
          :http-request="uploadPic2"
          :on-success="handlePicitemSuccess"
          :before-upload="beforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-error="uploadErr"
          :file-list="picList"
          action
        >
          <i v-loading="picListLoading" class="el-icon-plus pic-uploader-icon" />
          <div slot="tip" class="tip-text">（注：最多支持上传9张图片，单张图片不可超过10M）</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" class="pic-item">
        </el-dialog>
      </el-form-item>
    </el-form>
    <div class="bottom-btns">
      <el-button size="small" round plain @click="backPage">取消</el-button>
      <el-button type="primary" size="small" round @click="saveMenu">保存</el-button>
    </div>
  </div>
</template>

<script>
import { create, one, update } from '@/api/menu'
import oss from '@/utils/client'

export default {
  data() {
    const contentRule = (rule, value, callback) => {
      if (!value) {
        if (!this.formData.picList || !this.formData.picList.length) {
          callback(new Error('描述内容及图片列表不能均为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const picListRule = (rule, value, callback) => {
      if (!value || !value.length) {
        if (!this.formData.content) {
          callback(new Error('描述内容及图片列表不能均为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      loading: false,
      dialogVisible: false,
      avatarLoading: false,
      picListLoading: false,
      dialogImageUrl: '',
      picList: [],
      formData: {
        title: '',
        avatar: '',
        content: '',
        picList: []
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        avatar: [
          { required: false, message: '请上传头像', trigger: ['change', 'blur'] }
        ],
        content: [
          { required: true, validator: contentRule, trigger: 'blur' }
        ],
        picList: [
          { required: true, validator: picListRule, trigger: ['change', 'blur'] }
        ]
      }
    }
  },

  created() {
    if (this.$route.query.id) {
      this.getMenu(this.$route.query.id)
    }
  },

  methods: {
    getMenu(menu_id) {
      this.loading = true
      one({ menu_id }).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        res.data.content && (res.data.content = JSON.parse(res.data.content))
        this.picList.splice(0)
        this.formData = Object.assign({}, this.formData, {
          title: res.data.title,
          avatar: res.data.avatar,
          content: res.data.content ? res.data.content.detail : '',
          picList: res.data.content ? res.data.content.picList : []
        })
        if (res.data.content && res.data.content.picList) {
          res.data.content.picList.forEach(item => {
            const time = Date.now()
            const str = Math.round(Math.random() * 10000) + ''
            this.picList.push({
              name: time + str,
              url: item,
              uid: time + str
            })
          })
        }
      })
    },

    async uploadPic1(file) {
      this.avatarLoading = true
      oss.ossUploadFile(file)
    },
    async uploadPic2(file) {
      this.picListLoading = true
      oss.ossUploadFile(file)
    },

    handleAvatarSuccess(file) {
      if (file) {
        this.$set(this.formData, 'avatar', file.url)
        this.avatarLoading = false
      }
    },
    handlePicitemSuccess(response, file, fileList) {
      if (response) {
        this.formData.picList.push(response.url)
        this.picListLoading = false
        this.$refs.addForm.validateField('picList')
        this.picList = fileList
      }
    },
    handleRemove(file, fileList) {
      this.picList = fileList
      this.formData.picList = this.formData.picList.filter(item => item !== file.response.url)
      this.$refs.addForm.validateField('picList')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },

    uploadErr(err) {
      console.log(err, 'err')
      this.avatarLoading = this.picListLoading = false
      this.$message.error('上传失败，请重试')
    },

    backPage() {
      this.$router.back()
    },

    saveMenu() {
      let canContinue
      this.$refs.addForm.validate(valid => {
        if (valid) {
          canContinue = true
        }
      })
      if (canContinue) {
        this.loading = true
        const content = {
          detail: this.formData.content,
          picList: this.formData.picList
        }
        const params = {
          title: this.formData.title,
          avatar: this.formData.avatar,
          content
        }
        if (this.$route.query.id) {
          params.menu_id = this.$route.query.id
          update(params).then(res => {
            this.loading = false
            if (res.err_code !== 0) return
            this.$message.success('修改成功')
            this.$router.back()
          })
          return
        }
        create(params).then(res => {
          this.loading = false
          if (res.err_code !== 0) return
          this.$message.success('添加成功')
          this.$router.back()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-top: 20px;
}
.pic-uploader {
  & ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .el-loading-spinner {
      margin-top: 10px;
      transform: translateY(-50%);
    }
  }
  & ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
  & ::v-deep .el-upload-list__item {
    width: 120px;
    height: 120px;
  }
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .tip-text {
    font-size: 12px;
    color: #999;
  }
}

.pic-item {
  object-fit: contain;
}
</style>
