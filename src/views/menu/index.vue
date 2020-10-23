<template>
  <div v-loading="loading" class="page">
    <div class="filter-module">
      <!-- <svg-icon icon-class="password" />
      <svg-icon icon-class="dashboard" />
      <svg-icon icon-class="example" />
      <svg-icon icon-class="eye" />
      <svg-icon icon-class="eye-open" />
      <svg-icon icon-class="form" />
      <svg-icon icon-class="link" />
      <svg-icon icon-class="nested" />
      <svg-icon icon-class="table" />
      <svg-icon icon-class="tree" />
      <svg-icon icon-class="user" /> -->
      <el-form ref="filterForm" :model="filterForm" inline class="form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="filterForm.title" size="small" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item class="btn-list">
          <el-button type="primary" size="small" round @click="pageNum = 1; getData()">查询</el-button>
          <el-button size="small" round @click="resetForm">重置</el-button>
          <el-button type="success" size="small" round @click="toAddPage()">新增</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="table-module">
      <el-table :data="tableData" size="small" style="width: 100%" border>
        <el-table-column label="标题" prop="title" align="center" width="140px"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="90px">
          <template #default="{row}">
            <div class="pic-item-box">
              <el-image class="avatar" :src="row.avatar || pic" fit="cover" :previewSrcList="[pic]" />
              <div class="pic-mask"><i class="el-icon-view"></i></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="detail" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="图片列表" prop="picList" align="center">
          <!-- <template #default="{row}"> -->
          <template>
            <div class="flex pic-list">
              <div v-for="(item, index) in list" :key="index" class="pic-item-box">
                <el-image class="avatar" :src="item" fit="cover" :previewSrcList="list" />
                <div class="pic-mask"><i class="el-icon-view"></i></div>
              </div>
            </div>
          </template>
          <!-- </template> -->
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetailPage(scope.row.menu_id)">详情</el-button>
            <el-button type="text" size="small" @click="toAddPage(scope.row.menu_id)">编辑</el-button>
            <el-button v-if="scope.row.top_at === '0'" type="text" size="small" @click="setTop(scope.row.menu_id)">置顶</el-button>
            <el-button v-else type="text" size="small" @click="cancelTop(scope.row.menu_id)">取消置顶</el-button>
            <el-button type="text" size="small" style="color: red" @click="delMenu(scope.row.menu_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-module">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Total"
        @size-change="pageSizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { getList, del, setTop, cancelTop } from '@/api/menu'

export default {
  name: 'Menu',
  data() {
    return {
      loading: false,
      pic: 'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
      list: [
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
        'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png'
      ],
      pageNum: 1,
      pageSize: 10,
      Total: 0,
      filterForm: {
        title: ''
      },
      tableData: []
    }
  },

  created() {
    this.getData()
  },

  methods: {
    getData() {
      this.loading = true
      this.tableData.splice(0)
      getList({
        title: this.filterForm.title,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        res.data.list.forEach(item => {
          item.content && (item.content = JSON.parse(item.content))
          item.picList = item.content ? item.content.picList : []
          item.detail = item.content ? item.content.detail : ''
          this.tableData.push(item)
        })
        this.Total = +res.data.count
      })
    },

    resetForm() {
      this.$refs.filterForm.resetFields()
    },

    toAddPage(id) {
      this.$router.push({
        name: id ? 'Edit' : 'Add',
        params: { id }
      })
    },

    delMenu (menu_id) {
      this.$confirm('确认删除该菜单？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        del({menu_id}).then(res => {
          this.loading = false
          if (res.err_code === 0) {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }).catch(() => {})
    },

    setTop (menu_id) {
      this.loading = true
      setTop({menu_id}).then(res => {
        if (res.err_code === 0) {
          this.$message.success('置顶成功')
          this.getData()
        }
      })
    },

    cancelTop (menu_id) {
      this.loading = true
      cancelTop({menu_id}).then(res => {
        if (res.err_code === 0) {
          this.$message.success('取消置顶成功')
          this.getData()
        }
      })
    },

    toDetailPage (id) {
      this.$router.push({
        name: 'Detail',
        params: {
          id
        }
      })
    },

    currentChange(val) {
      this.pageNum = val
      this.getData()
    },
    pageSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-module {
  padding: 0 20px;
  .form {
    .btn-list {
      margin-left: 20px;
    }
  }
}
.table-module {
  .pic-list {
    flex-wrap: nowrap;
  }
  .pic-item-box {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
}
</style>
