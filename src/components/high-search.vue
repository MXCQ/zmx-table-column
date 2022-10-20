<template>
  <div class="el-search">
    <div class="ccui-search-wrapper">
      <slot></slot>
      <div class="el-searchs">
        <div :style="{ width: width }" class="el-searchs-box">
          <el-dropdown
            :placement="placement"
            :trigger="trigger"
            @command="handleChange"
            v-if="isSimple"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom duidui" style=""></i
              >{{ thisLeftName }} :
            </span>
            <el-dropdown-menu
              class="el-switch-component-dropdown-menu"
              slot="dropdown"
            >
              <el-dropdown-item
                :command="index"
                :key="index"
                v-for="(item, index) in searchLabel"
                :class="item === thisLeftName ? 'selected' : ''"
              >
                {{ item }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="el-searchs-left">
            <span class="simple" v-if="!isSimple"> {{ thisLeftName }} : </span>
          </div>
          <div class="el-searchs-right">
            <slot name="search" :formProp="formProp"></slot>
          </div>
          <el-button
            @click="returnSeachData(true)"
            size="mini"
            style="width: 50px;"
            v-if="isBtn"
            type="text"
            >{{ searchBtn }}
          </el-button>
          <div
            :class="[isShowBottom ? 'search-icon-close' : 'search-icon-open']"
            @click="fg"
            v-if="gl"
          ></div>
        </div>
      </div>
    </div>
    <div class="el-searchs-bottom" v-show="isShowBottom">
      <el-form :model="form" class="el-searchs-bottom-form" ref="form">
        <el-row :gutter="10">
          <template v-for="(item, index) of seachItemSlotName">
            <el-col :key="index" :span="sinNmu(index)">
              <el-form-item
                :class="reg[index].formClass ? reg[index].formClass : ''"
                :label="seachItemLabel[index] + '：'"
                label-width="94px"
              >
                <slot :name="seachItemSlotName[index]"></slot>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24" style="text-align: center">
            <div class="ccui-form-wrapper-search-button">
              <el-button
                @click="returnSeachData(false)"
                size="mini"
                type="primary-font-mini"
                >{{ searchBtn }}
              </el-button>
              <el-button @click="resetForm" size="mini" type="default-mini"
                >{{ resetBtn }}
              </el-button>
              <div @click="fg" class="icon icon-ccui-downdown"></div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElSearch',

  data () {
    return {
      // sinNmu: 8,
      seachItemSlotName: [],
      seachItemLabel: [],
      seachItem: [],
      form: {},
      gl: true,
      isSimple: true,
      vnodec: [],
      searchLabel: [],
      thisLeftName: '',
      itemVnode: [],
      thisShowIndex: 0,
      isShowBottom: false,
      reg: [],
      myWidth: 0
    }
  },
  props: {
    formProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: String,
      default: '380px'
    },
    searchBtn: {
      type: String,
      default: '搜索'
    },
    resetBtn: {
      type: String,
      default: '重置'
    },
    showIndex: {
      type: Number,
      default: 0
    },
    isBtn: {
      type: Boolean,
      default: true
    },
    trigger: {
      default: 'click',
      validator: function (value) {
        return ['hover', 'click'].includes(value)
      }
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    putReset: {
      type: Boolean,
      default: false
    },
    spoNum: {
      type: Number,
      default: 3
    },
    colNum: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showIndex (index) {
      this.thisShowIndex = index
    },
    formProp (index) {
      this.form = index
    },
    isShow (val) {
      this.isShowBottom = val
    }
  },
  mounted () {
    // this.sinNmu = 24 / parseInt(this.spoNum, 0);
    // if (this.isLeftSide === true) {
    //   if (this.spoNum >= 3) {
    //     this.sinNmu = 24 / 7;
    //   } else {
    //     this.sinNmu = 24 / parseInt(this.spoNum, 0);
    //   }
    // } else {
    //   this.sinNmu = 24 / parseInt(this.spoNum, 0);
    // }
    this.isShowBottom = this.isShow
    this.form = this.formProp
    for (let key in this.$slots) {
      if (key.includes('searchItem')) {
        this.seachItemSlotName.push(key)
        this.seachItemLabel.push(this.$slots[key][0].data.attrs.searchLabel)
        this.reg.push({
          formClass: this.$slots[key][0].data.attrs.formClass
        })
        this.seachItem.push(this.$slots[key])
      }
    }

    if (this.seachItemSlotName.length === 0) {
      this.gl = false
    }

    let vnodeo = this.$slots.search.filter((item, index) => {
      if (item.tag && item.componentOptions) {
        return item
      }
    })
    // (vnodeo);
    this.vnodec = vnodeo.map(({ componentInstance }) => {
      this.searchLabel.push(componentInstance.$attrs.searchLabel)
      return componentInstance
    })

    if (this.vnodec.length > 1) {
      this.thisShowIndex = this.showIndex
      this.isSimple = true
    } else {
      this.thisShowIndex = 0
      this.isSimple = false
      this.gl = false
    }
    this.gaga(this.thisShowIndex)
  },
  methods: {
    sinNmu (index) {
      console.log(this.spoNum)
      if (this.spoNum === 3) {
        if (this.colNum.index) {
          if (index === this.colNum.index) {
            return this.colNum.sinNum
          } else {
            return (24 - this.colNum.sinNum) / 2
          }
        } else {
          return 8
        }
      } else {
        return 12
      }
    },
    resetForm () {
      for (let key in this.form) {
        let dataType = this.getDataType(this.form[key])
        if (dataType === 'Array') {
          this.form[key] = []
        } else if (dataType === 'Object') {
          this.form[key] = {}
        } else if (dataType === 'Boolean') {
          this.form[key] = false
        } else {
          this.form[key] = ''
        }
      }
      this.$refs['form'].resetFields()
      this.$emit('resetForm')
    },

    getDataType (o) {
      if (o instanceof Array) {
        return 'Array'
      } else if (o instanceof Object) {
        return 'Object'
      } else if (typeof o === 'boolean') {
        return 'Boolean'
      } else {
        return 'String'
      }
    },

    returnSeachData (flag) {
      let obj = {}
      if (flag) {
        let { key } = this.getSelectedKeyValue(this.thisShowIndex)
        let { value } = this.getSelectedKeyValue(this.thisShowIndex)
        if (value) {
          obj[key] = value
        }
      } else {
        for (let i in this.form) {
          if (this.form[i]) {
            obj[i] = this.form[i]
          }
        }
      }
      this.$emit('search', obj)
    },
    fg () {
      this.isShowBottom = !this.isShowBottom
      this.$emit('update:isShow', this.isShowBottom)
      if (!this.isShowBottom && this.putReset) {
        this.resetForm()
      }
    },
    handleChange (index) {
      this.thisShowIndex = index
      let { key } = this.getSelectedKeyValue(index)
      let { value } = this.getSelectedKeyValue(index)
      this.$emit('change', index, key, value)
      if (this.selectClear && !this.isShowBottom) {
        this.resetForm()
      }
      this.gaga(index)
    },
    getSelectedKeyValue (index) {
      this.$slots.search.forEach((item, index) => {
        if (item.tag === undefined) {
          this.$slots.search.splice(index, 1)
        }
      })
      let model = this.$slots.search[index].data.model
      let key = model.expression.split('.')[1]
      let value = model.value
      return {
        key,
        value
      }
    },
    gaga (i) {
      this.vnodec.forEach((item, index) => {
        if (index !== i) {
          item.$el.style.display = 'none'
        } else {
          item.$el.style.display = 'block'
          this.thisLeftName = this.searchLabel[i]
        }
      })
    }
  }
}
</script>
