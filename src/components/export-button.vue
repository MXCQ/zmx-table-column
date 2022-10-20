<template>
  <div class="el-export-button">
    <el-popover
      placement="top"
      width="80"
      popVisible-arrow="false"
      v-model="popVisible"
      trigger="click"
      ref="testPopover"
      popper-class="export-popover"
    >
      <div style="height: 62px; text-align: right; margin: 0">
        <el-button
          class="export-excel-button"
          size="mini"
          type="text"
          @click="exportExcel"
          >{{ excel }}</el-button
        >
        <el-button
          class="export-pdf-button"
          size="mini"
          type="text"
          @click="exportPdf"
          >{{ pdf }}</el-button
        >
      </div>
      <el-button class="export-format" @click="exportFormat" slot="reference">
        <!--        <i v-show="iconTop" class="el-icon-caret-top"/>-->
        <!--        <i v-show="iconBottom" class="el-icon-caret-bottom"/>-->
        <i class="icon-ccui-export" /><span>{{ msg }}</span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'ElExportButton',
  data () {
    return {
      msg: '导出',
      excel: '导出当前页',
      pdf: '导出全部',
      popVisible: false,
      iconTop: true,
      iconBottom: false
    }
  },
  mounted () {
    // this.$refs.testPopover.$refs.popper.style.width = '80px';
  },
  methods: {
    exportFormat (value) {
      // this.popVisible = true;
      this.iconTop = !this.iconTop
      this.iconBottom = !this.iconBottom
      this.$emit('export-format', value)
    },
    exportExcel (value) {
      this.popVisible = false
      this.iconTop = true
      this.iconBottom = false
      this.$emit('export-excel', value)
    },
    exportPdf (value) {
      this.popVisible = false
      this.iconTop = true
      this.iconBottom = false
      this.$emit('export-pdf', value)
    }
  }
}
</script>
