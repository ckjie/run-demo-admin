<template>
  <div>
    <el-form :model="detail" label-width="120px">
      <el-form-item label="标题 ：">
        <span>{{ detail.title }}</span>
      </el-form-item>
      <el-form-item label="头像 ：">
        <el-image class="pic-item" :src="detail.avatar" fit="cover" :previewSrcList="[detail.avatar]"></el-image>
      </el-form-item>
      <el-form-item label="描述 ：">
        <div class="detail-content">{{ detail.content }}</div>
      </el-form-item>
      <el-form-item label="图片列表 ：">
        <el-carousel class="pic-carousel" :interval="4000" type="card" height="200px" indicator-position="none">
          <el-carousel-item v-for="(item, index) in detail.picList" :key="index">
            <img class="carousel-pic-item" :src="item" @click="dialogVisible = true; dialogImageUrl = item">
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
    <div class="bottom-btns">
      <el-button size="small" round plain @click="backPage">取消</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import { one } from '@/api/menu'
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      detail: {}
    }
  },

  created () {
    this.getData(this.$route.params.id)
  },

  methods: {
    getData (menu_id) {
      this.loading = true
      one({menu_id}).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        res.data.content && (res.data.content = JSON.parse(res.data.content))
        this.detail = Object.assign({}, this.detail, {
          title: res.data.title,
          avatar: res.data.avatar || 'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
          content: res.data.content ? res.data.content.detail : '',
          picList: res.data.content ? res.data.content.picList : []
        })
        for (let i = 0; i < 9; i++) {
          this.detail.picList.push('https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png')
        }
      })
    },

    backPage () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.pic-item {
  width: 120px;
  height: 120px;
  display: block;
}
.detail-content {
  width: 50%;
  word-break: break-all;
  line-height: 1.8;
}
.pic-carousel {
  width: 400px;
  .carousel-pic-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
