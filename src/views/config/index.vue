<template>
  <div v-loading="loading">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabs" :key="item.name" :label="item.label" :name="item.name">
        <!-- 常用语、收费规则 -->
        <div>
          <div class="btn-list">
            <el-button v-if="!isEdit" type="warning" size="small" @click="isEdit = true">编辑</el-button>
            <el-button v-if="isEdit" size="small" @click="cancelEdit">取消</el-button>
            <el-button v-if="isEdit" type="primary" size="small" @click="saveEdit">保存</el-button>
          </div>
          <div v-for="child in titleList" :key="child.key" class="section">
            <div class="title">{{ child.label }}：</div>
            <div v-show="activeTab === 'KEY_USED_WORDS' && typeof(currentConfig) !== 'string'" class="words-list">
              <el-tag class="tag-item" v-for="(tag, idx) in currentConfig[child.key]" :key="idx" :closable="isEdit" @close="handleClose(child.key, idx)">{{ tag }}</el-tag>
              <el-input class="input-new-tag" v-if="currenteditKey === child.key" v-model="inputValue" :ref="child.key" size="small" @keyup.enter.native="handleInputConfirm(child.key)" @blur="handleInputConfirm(child.key)"></el-input>
              <el-button v-if="currenteditKey !== child.key && isEdit" class="button-new-tag" size="small" @click="showInput(child.key, index)">+ 添加</el-button>
            </div>
            <div v-if="currentConfig[child.key] && !Array.isArray(currentConfig[child.key]) && activeTab === 'KEY_CHARGE_RULE'" class="section">
              <el-form :model="currentConfig[child.key]" :rules="rules" :ref="child.key" inline>
                <el-form-item label="起步价" prop="starting_price">
                  <el-input :disabled="!isEdit" type="number" v-model.number="currentConfig[child.key].starting_price" size="small" placeholder="请输入起步价"></el-input>
                </el-form-item>
                <el-form-item v-if="child.key !== 'order_type_transact'" label="起步距离" prop="starting_distance">
                  <el-input :disabled="!isEdit" type="number" v-model.number="currentConfig[child.key].starting_distance" size="small" placeholder="请输入起步距离"></el-input>
                </el-form-item>
                <el-form-item v-if="child.key !== 'order_type_transact'" label="超出叠加费" prop="beyond_price">
                  <el-input :disabled="!isEdit" type="number" v-model.number="currentConfig[child.key].beyond_price" size="small" placeholder="请输入超出叠加费"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="价格说明" name="KEY_SERVICE_AGREEMENT">
        <div>
          <div class="btn-list">
            <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
          </div>
          <div v-if="typeof(richText) === 'string'" class="box">
            <Tinymce id="KEY_SERVICE_AGREEMENT" ref="KEY_SERVICE_AGREEMENT" v-model="richText" :height="736" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="跑题服务协议" name="KEY_CHARGE_NOTE">
        <div>
          <div class="btn-list">
            <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
          </div>
          <div v-if="typeof(richText) === 'string'" class="box">
            <Tinymce id="KEY_CHARGE_NOTE" ref="KEY_CHARGE_NOTE" v-model="richText" :height="736" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getConfig, setConfig } from '@/api/config'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'Config',
  components: {
    Tinymce
  },

  data () {
    return {
      loading: false,
      isEdit: false,
      inputValue: '',
      activeTab: 'KEY_USED_WORDS',
      currenteditKey: '',
      tabs: [
        { label: '常用语', name: 'KEY_USED_WORDS' },
        { label: '收费规则', name: 'KEY_CHARGE_RULE' }
      ],
      titleList: [
        { label: '帮我买', key: 'order_type_buy' },
        { label: '代取送', key: 'order_type_deliver' },
        { label: '帮帮我', key: 'order_type_transact' },
        { label: '包裹单', key: 'order_type_pick_up' }
      ],
      currentConfig: {},
      backupConfig: {},
      richText: '',
      rules: {
        starting_price: [
          { required: true, message: '请输入起步价', trigger: 'blur' }
        ],
        starting_distance: [
          { required: true, message: '请输入起步距离', trigger: 'blur' }
        ],
        beyond_price: [
          { required: true, message: '请输入超出叠加费', trigger: 'blur' }
        ]
      }
    }
  },
  
  created () {
    this.getCurrent()
  },

  methods: {
    getCurrent () {
      this.loading = true
      getConfig({ name: this.activeTab }).then(res => {
        this.loading = false
        if (res.err_code === 0) {
          if (['KEY_USED_WORDS', 'KEY_CHARGE_RULE'].includes(this.activeTab)) {
            this.currentConfig = JSON.parse(res.data)
            this.backupConfig = JSON.parse(res.data)
          } else {
            this.richText = this.richText = res.data
            this.$refs[this.activeTab].setContent(res.data)
          }
        }
      }).catch(err => this.loading = false)
    },

    handleClick (val) {
      this.isEdit = false
      this.currenteditKey = ''
      this.getCurrent()
    },

    cancelEdit () {
      this.isEdit = false
      this.currenteditKey = ''
      this.currentConfig = JSON.parse(JSON.stringify(this.backupConfig))
    },
    saveEdit () {
      this.loading = true
      const params = {
        name: this.activeTab
      }
      if (['KEY_USED_WORDS', 'KEY_CHARGE_RULE'].includes(this.activeTab)) {
        params.value = this.currentConfig
      } else {
        params.value = this.richText
      }
      setConfig(params).then(res => {
        this.loading = false
        if (res.err_code === 0) {
          this.isEdit = false
          this.currenteditKey = ''
          this.$message.success('编辑成功')
          this.getCurrent()
        }
      })
    },

    handleClose (key, idx) {
      this.currentConfig[key].splice(idx, 1)
    },
    showInput (key, idx) {
      this.currenteditKey = key
      this.$nextTick(_ => {
        this.$refs[key][idx].$refs.input.focus()
      })
    },
    handleInputConfirm (key) {
      let inputValue = this.inputValue
      if (inputValue) {
        this.currentConfig[key].push(inputValue)
      }
      this.currenteditKey = ''
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-list {
  margin: 0 0 20px;
}

.section {
  margin-bottom: 20px;

  .title {
    margin: 10px 0;
    font-weight: bold;
    line-height: 20px;
    text-indent: 20px；
    letter-spacing 1px；
    border-left： 2px solid #0093FF;
  }
  .words-list {
    .tag-item {
      margin: 0 5px 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin: 0 0 10px 10px;
      vertical-align: bottom;
    }
  }

  & ::v-deep .el-form-item {
    margin-left: 20px;
  }
}

.box {
  width: 414px;
  margin: 0 auto;
}
</style>
