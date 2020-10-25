<template>
  <div v-loading="loading" class="page">
    <div class="filter-module">
      <el-form ref="filterForm" :model="filterForm" inline class="form">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="filterForm.realname" size="small" maxlength="20" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="filterForm.phone" size="small" maxlength="11" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item class="btn-list">
          <el-button type="primary" size="small" round @click="pageNum = 1; getData()">查询</el-button>
          <el-button size="small" round @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="table-module">
      <el-table :data="tableData" size="small" style="width: 100%" border>
        
        <el-table-column label="头像" prop="avatar" align="center" width="90px">
          <template #default="{row}">
            <div class="pic-item-box">
              <el-image class="avatar" :src="row.avatar || pic" fit="cover" :previewSrcList="[pic]" />
              <div class="pic-mask"><i class="el-icon-view"></i></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realname" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template #default="{ row }">
            <span>{{ row.sex === '0' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" prop="phone" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <span v-if="row.status === '0'">待审核</span>
            <span v-else-if="row.status === '1'">已激活</span>
            <span v-else-if="row.status === '2'">已拒绝</span>
            <span v-else-if="row.status === '3'">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <el-button v-if="row.status === '0'" type="text" size="small" @click="changeStatus(row.courier_id, 1)">通过</el-button>
            <el-button v-if="row.status === '0'" type="text" size="small" @click="changeStatus(row.courier_id, 2)">拒绝</el-button>
            <el-button v-if="row.status === '3'" type="text" size="small" @click="changeStatus(row.courier_id, 1)">启用</el-button>
            <el-button v-if="row.status === '1'" type="text" size="small" style="color: red" @click="changeStatus(row.courier_id, 3)">禁用</el-button>
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

    <el-dialog
      class="input-dialog"
      :visible.sync="showInputDialog"
      width="25%"
      append-to-body
      center
      @close="closeInputDialog">
      <div slot="title">
        <div>拒绝申请</div>
      </div>
      <div class="body">
        <el-input v-model.trim="reason" type="text" size="small" maxlength="50" placeholder="请输入拒绝的原因"></el-input>
      </div>
      <div slot="footer">
        <el-button round size="small" @click="showInputDialog = false">取消</el-button>
        <el-button type="primary" size="small" round @click="confirmRefuse">{{ reason ? '确定' : '不填了，直接拒绝' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, updateStatus } from '@/api/rider'

export default {
  name: 'Menu',
  data() {
    return {
      loading: false,
      showInputDialog: false,
      pic: 'https://img.yasuotu.com/uploads/moban/self/2019/11/12/thumb/67825e4cd63629194d4c4c9b9e95d4d6.png',
      pageNum: 1,
      pageSize: 10,
      Total: 0,
      filterForm: {
        realname: '',
        phone: ''
      },
      tableData: [],
      reason: '',
      currentItem: {}
    }
  },

  created() {
    this.getData()

  },

  methods: {
    getData () {
      this.loading = true
      const params = {
        ...this.filterForm,
        page: this.pageNum,
        size: this.pageSize
      }
      getList(params).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        this.tableData = res.data
      })
    },

    changeStatus (courier_id, status) {
      if (status === 2 && !this.showInputDialog) {
        this.showInputDialog = true
        this.currentItem = Object.assign({}, this.currentItem, {
          courier_id,
          status
        })
        return
      }
      this.loading = true
      const params = {
        courier_id,
        status
      }
      this.reason && (params.reason = this.reason)
      updateStatus(params).then(res => {
        this.loading = false
        this.showInputDialog && (this.showInputDialog = false)
        if (res.err_code !== 0) return
        this.$message.success('操作成功')
        this.getData()
      })
    },

    resetForm() {
      this.$refs.filterForm.resetFields()
    },

    currentChange(val) {
      this.pageNum = val
      this.getData()
    },
    pageSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.getData()
    },

    closeInputDialog () {
      this.reason = ''
    },

    confirmRefuse () {
      this.changeStatus(this.currentItem.courier_id, this.currentItem.status)
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

.input-dialog {
  .body {
    padding-top: 20px;
  }
}
</style>
