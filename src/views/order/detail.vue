<template>
  <div>
    <el-form :model="detail" label-width="120px" inline class="main-form">
      <el-form-item label="订单类型 ：">
        <span v-if="detail.type === '1'">帮我买</span>
        <span v-if="detail.type === '2'">代取送</span>
        <span v-if="detail.type === '3'">帮帮我</span>
        <span v-if="detail.type === '4'">包裹单</span>
      </el-form-item>
      <el-form-item label="订单状态 ：">
        <div v-if="detail.status === '0'">待支付</div>
        <div v-if="detail.status === '1'">代接单</div>
        <div v-if="detail.status === '2'">已接单</div>
        <div v-if="detail.status === '3'">已送达</div>
        <div v-if="detail.status === '4'">已完成</div>
        <div v-if="detail.status === '5'">已取消</div>
        <div v-if="detail.status === '6'">已退款</div>
      </el-form-item>
      <el-form-item label="下单时间 ：">
        <div>{{ detail.created_at | formatDate }}</div>
      </el-form-item>
      <el-form-item label="配送时间 ：">
        <div v-if="detail.params && detail.params.isNow">{{ detail.expect_deliver_at | formatDate }}</div>
        <div v-else>立即送达</div>
      </el-form-item>
      <el-form-item :label="detail.type === '1' ? '商品信息' : '物品信息'" class="fill-row">
        <div class="detail-content">{{ detail.remark }}</div>
      </el-form-item>
      <el-form-item v-if="detail.type === '1'" label="购买地址 ：" class="fill-row">
        <div v-if="detail.params && detail.params.buyType === 'address'">
          <span>{{ detail.params.buyAddress.address }} - {{detail.params.buyAddress.name}}</span>
        </div>
        <div v-else>就近购买</div>
      </el-form-item>
      <el-form-item v-else-if="detail.type === '3' && detail.params && detail.params.transactAddress1" label="代办点1" class="fill-row">
        <div>
          <span>{{ detail.params.transactAddress1.address }}</span>
          <span>（联系人：{{ detail.params.transactAddress1.realname }} {{ detail.params.transactAddress1.phone }}）</span>
        </div>
      </el-form-item>
      <el-form-item v-else label="取货地址 ：" class="fill-row">
        <div v-if="detail.type === '2' && detail.params">
          <span>{{ detail.params.deliverAddress.address }}</span>
          <span>（联系人：{{ detail.params.deliverAddress.realname }} {{ detail.params.deliverAddress.phone }}）</span>
        </div>
        <div v-if="detail.type === '4' && detail.params">
          <span>{{ detail.params.pickupAddress.address }}</span>
          <span>（联系人：{{ detail.params.pickupAddress.realname }} {{ detail.params.pickupAddress.phone }}）</span>
        </div>
      </el-form-item>
      <el-form-item v-if="['1', '2', '4'].includes(detail.type) && detail.params" label="收货地址 ：" class="fill-row">
        <div>
          <span>{{ detail.params.receiptAddress.address }}</span>
          <span>（联系人：{{ detail.params.receiptAddress.realname }} {{ detail.params.receiptAddress.phone }}）</span>
        </div>
      </el-form-item>
      <el-form-item v-else-if="detail.type === '3' && detail.params && detail.params.transactAddress2" label="代办点2" class="fill-row">
        <div>
          <span>{{ detail.params.transactAddress2.address }}</span>
          <span>（联系人：{{ detail.params.transactAddress2.realname }} {{ detail.params.transactAddress2.phone }}）</span>
        </div>
      </el-form-item>
      <el-form-item label="重量 ：">
        <div>{{ detail.item_weight }}公斤</div>
      </el-form-item>
      <el-form-item label="配送费 ：">
        <div>￥{{ detail.pay_price }}</div>
      </el-form-item>
      <el-form-item label="附加费 ：">
        <div>￥{{ detail.addition_price }}</div>
      </el-form-item>
      <el-form-item label="小费 ：">
        <div>￥{{ detail.tip }}</div>
      </el-form-item>
      <el-form-item label="合计 ：">
        <div>￥{{ detail.total }}</div>
      </el-form-item>
      <el-form-item label="收货码 ：">
        <div>{{ detail.code || '--' }}</div>
      </el-form-item>
      <div v-if="detail.params && detail.params.otherRequest">
        <el-form-item label="其他要求 ：">
          <div>￥{{ detail.params.otherRequest }}</div>
        </el-form-item>
      </div>
      <div v-if="detail.params && detail.params.attach.length">
        <el-form-item v-for="(item, idx) in detail.params.attach" :key="idx" :label="item.title + '：'">
          <div>{{ item.value.title + ' -￥' + item.value.price }}</div>
        </el-form-item>
      </div>
      <div v-if="detail.type === '3' && detail.params">
        <el-form-item label="订单号 ：">
          <div>{{ detail.params.orderCode || '--' }}</div>
        </el-form-item>
        <el-form-item label="取货码 ：">
          <div>{{ detail.params.pickupCode || '--' }}</div>
        </el-form-item>
        <el-form-item label="包裹信息 ：">
          <div>{{ detail.params.contactDetail || '--' }}</div>
        </el-form-item>
        <el-form-item label="发货地址 ：">
          <div>{{ detail.params.deliveryAddress || '--' }}</div>
        </el-form-item>
      </div>
      <div v-if="detail.params && detail.params.sound">
        <el-form-item label="录音 ：" class="fill-row">
          <audio :src="detail.params.sound" controls="controls"></audio>
        </el-form-item>
      </div>
      <div v-if="detail.params && detail.params.picList">
        <el-form-item label="图片 ：" class="fill-row">
          <div class="pic-list">
            <el-image class="pic-item" v-for="item in detail.params.picList" :key="item" :src="item" :preview-src-list="detail.params.picList" :fit="'cover'"></el-image>
          </div>
        </el-form-item>
      </div>
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
import { getDetail } from '@/api/order'
export default {

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
      dialogVisible: false,
      dialogImageUrl: '',
      detail: {}
    }
  },

  created() {
    if (this.$route.query.order_hash) {
      this.getData(this.$route.query.order_hash)
    }
  },

  methods: {
    getData(order_hash) {
      this.loading = true
      getDetail({ order_hash }).then(res => {
        this.loading = false
        if (res.err_code !== 0) return
        res.data.addition.params = JSON.parse(res.data.addition.params)
        res.data.addition.params.picList && (res.data.addition.params.picList = JSON.parse(res.data.addition.params.picList))
        const info = {
          ...res.data.addition,
          ...res.data
        }
        delete info.addition
        this.detail = info
        console.log(info, 'rrr')
      })
    },

    backPage() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-form {
  ::v-deep .el-form-item {
    width: 40%;
    margin-left: 5%;
  }
  .fill-row {
    width: 90%;
  }
}
.pic-item {
  width: 120px;
  height: 120px;
  display: block;
}
.detail-content {
  word-break: break-all;
}

.pic-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .pic-item {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
