<template>
  <div v-loading="loading" class="page">
    <div class="filter-module">
      <el-form ref="filterForm" :model="filterForm" inline class="form">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="filterForm.status" size="small">
            <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="btn-list">
          <el-button type="primary" size="small" round @click="pageNum = 1; getData()">查询</el-button>
          <el-button size="small" round @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="table-module">
      <el-table :data="tableData" size="small" style="width: 100%" border>
        <el-table-column label="订单类型" align="center">
          <template #default="{row}">
            <span v-if="row.type === '1'">帮我买</span>
            <span v-else-if="row.type === '2'">代取送</span>
            <span v-else-if="row.type === '3'">帮帮我</span>
            <span v-else-if="row.type === '4'">包裹单</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" show-overflow-tooltip>
          <template #default="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template #default="{row}">
            <span>{{ row.created_at | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送时间" align="center">
          <template #default="{row}">
            <span v-if="row.params && row.params.isNow">立即送达</span>
            <span v-else>{{ row.expect_deliver_at | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量" align="center">
          <template #default="{row}">
            <span>{{ row.item_weight }}公斤</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="配送费（元）" align="center">
          <template #default="{row}">
            <span>{{ row.pay_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附加费（元）" align="center">
          <template #default="{row}">
            <span>{{ row.addition_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小费（元）" align="center">
          <template #default="{row}">
            <span>{{ row.tip }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="合计（元）" align="center">
          <template #default="{row}">
            <span>{{ row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货码" align="center">
          <template #default="{row}">
            <span>{{ row.code || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{row}">
            <span v-if="row.status === '0'">待支付</span>
            <span v-else-if="row.status === '1'">待接单</span>
            <span v-else-if="row.status === '2'">已接单</span>
            <span v-else-if="row.status === '3'">已送达</span>
            <span v-else-if="row.status === '4'">已完成</span>
            <span v-else-if="row.status === '5'">已取消</span>
            <span v-else-if="row.status === '6'">已退款</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="toDetail(row.order_hash)">详情</el-button>
            <el-button v-if="['1', '2', '3', '4'].includes(row.status)" type="text" size="small" style="color: red" @click="refundPrice(row)">退款</el-button>
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
import { getList, refund } from '@/api/order'

export default {
  name: 'Menu',

  filters: {
    formatDate: (time) => {
      if (time <= 0) return time
      const date = new Date(time * 1000)
      const y = date.getFullYear()
      const m = ('0' + (date.getMonth() + 1)).slice(-2)
      const d = ('0' + date.getDate()).slice(-2)
      const time2 = date.toTimeString().slice(0, 5)
      return `${y}-${m}-${d} ${time2}`
    }
  },
  data() {
    return {
      loading: false,
      showInputDialog: false,
      pageNum: 1,
      pageSize: 10,
      Total: 0,
      filterForm: {
        status: ''
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '待支付', value: '0' },
        { label: '待接单', value: '1' },
        { label: '已接单', value: '2' },
        { label: '已送达', value: '3' },
        { label: '已完成', value: '4' },
        { label: '已取消', value: '5' },
        { label: '已退款', value: '6' }
      ],
      tableData: [],
      reason: '',
      currentItem: {}
    }
  },

  created() {
    this.getData()
  },

  methods: {
    getData() {
      this.loading = true
      const params = {
        ...this.filterForm,
        page: this.pageNum,
        size: this.pageSize
      }
      getList(params).then(res => {
        this.loading = false
        this.tableData.splice(0)
        if (res.err_code !== 0) return
        res.data.list.forEach(item => {
          item.addition.params = JSON.parse(item.addition.params)
          item = {
            ...item.addition,
            ...item
          }
          delete item.addition
          this.tableData.push(item)
        })
        this.Total = +res.data.count
      })
    },

    toDetail(order_hash) {
      this.$router.push({
        name: 'orderDetail',
        query: {
          order_hash
        }
      })
    },

    refundPrice(row) {
      console.log(row, 'rrrr')
      this.$confirm('确认对该订单进行退款操作？', '提示', {
        confirmButtonText: '退款',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        refund({
          order_hash: row.order_hash,
          refund_price: row.total
        }).then(res => {
          this.loading = false
          if (res.err_code === 0) {
            this.$message.success('退款成功')
            this.getData()
          }
        })
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
