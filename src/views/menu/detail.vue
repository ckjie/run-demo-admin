<template>
  <div>
    <el-form :model="detail" label-width="120px">
      <el-form-item label="标题 ：">
        <span>{{ detail.title }}</span>
      </el-form-item>
      <el-form-item label="头像 ：">
        <el-image class="pic-item" :src="detail.avatar" fit="cover" :preview-src-list="[detail.avatar]" />
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
      <el-button size="small" round plain @click="backPage">返回</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import { one } from '@/api/menu'
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      detail: {}
    }
  },

  created() {
    if (this.$route.query.id) {
      this.getData(this.$route.query.id)
    }
  },

  methods: {
    getData(menu_id) {
      this.loading = true
      one({ menu_id }).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        res.data.content && (res.data.content = JSON.parse(res.data.content))
        this.detail = Object.assign({}, this.detail, {
          title: res.data.title,
          avatar: res.data.avatar || require('@/assets/images/pic-loading.png'),
          content: res.data.content ? res.data.content.detail : '',
          picList: res.data.content ? res.data.content.picList : []
        })
      })
    },

    backPage() {
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
