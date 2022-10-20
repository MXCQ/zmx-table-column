<template>
  <div class="app-container">
    <div class="app-main-container">
      <div class="el-search-wrapper">
        <div class="el-advanced-search-wrapper el-clearfix">
          <highSearch
            :formProp="formData"
            @search="search"
            :isShowSearch="isShowSearch"
            :selectClear="true"
            :isShow="isShow"
            :spoNum="2"
          >
            <div class="el-tab-wrapper">
              <el-button type="table-top-active" size="mini">
                数据查询</el-button
              >
            </div>
            <div class="el-extend-btn">
              <el-popover placement="left" trigger="click" v-if="false">
                <el-checkbox-group v-model="checkedTableList">
                  <el-checkbox
                    style="display: block"
                    v-for="item in tableThead"
                    :label="item.prop"
                    :key="item.prop"
                    >{{ item.label }}</el-checkbox
                  >
                </el-checkbox-group>
                <el-button slot="reference">表头设置</el-button>
              </el-popover>
              <exportButton
                placement="bottom"
                @export-excel="handleExport"
                @export-pdf="handleExport('all')"
              ></exportButton>
            </div>
            <template slot="search">
              <el-input
                v-model="formData.name"
                searchLabel="名称"
                placeholder="请输入"
                autocomplete="off"
                maxlength="50"
                clearable
                @keyup.enter.native="enterSearch"
              ></el-input>
            </template>
            <el-input
              v-model="formData.name"
              searchLabel="名称"
              placeholder="请输入"
              autocomplete="off"
              maxlength="50"
              clearable
              slot="searchItem1"
              style="max-width:400px"
            ></el-input>
            <!-- 表单高级搜索 -->
          </highSearch>
        </div>
      </div>
      <el-table
        v-loading="loading"
        ref="tableDataRef"
        :data="tableData"
        style="width:100%"
      >
        <el-table-column label="序号" type="index" align="center" width="60">
        </el-table-column>
        <template v-for="(table, index) in tableThead">
          <el-table-column
            :fixed="table.fixed || false"
            :key="index"
            :type="table.type"
            :label="table.label"
            :align="table.align || 'center'"
            :header-align="table.headerAlign || 'left'"
            :width="table.width"
            :min-width="table.minWidth"
            :prop="table.prop"
            :formatter="formatterList[table.formatterName]"
            :show-overflow-tooltip="true"
          >
            <template v-if="table.children && table.children.length > 0">
              <el-table-column
                v-for="(child, cIdx) in table.children"
                :fixed="child.fixed || false"
                :key="index + '' + cIdx"
                :type="child.type"
                :label="child.label"
                :align="child.align || 'center'"
                :header-align="child.headerAlign || 'center'"
                :min-width="child.minWidth"
                :prop="child.prop"
                :formatter="formatterList[child.formatterName]"
                :show-overflow-tooltip="true"
              >
                <template v-if="child.children && child.children.length > 0">
                  <el-table-column
                    v-for="(ch, cI) in child.children"
                    :fixed="ch.fixed || false"
                    :key="index + '' + cIdx + '' + cI"
                    :type="ch.type"
                    :label="ch.label"
                    :align="ch.align || 'center'"
                    :header-align="ch.headerAlign || 'center'"
                    :min-width="ch.minWidth"
                    :prop="ch.prop"
                    :formatter="formatterList[ch.formatterName]"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import exportButton from '@/components/export-button'
import highSearch from '@/components/high-search'
import { saveAs } from 'file-saver'
const ExcelJS = require('exceljs')
export default {
  name: 'HelloWorld',
  props: {
    getTableList: null
  },
  components: {
    exportButton,
    highSearch
  },
  data () {
    return {
      formData: {
        name: ''
      },
      isShowSearch: true,
      isShow: false,
      // 高级搜索数据 end
      loading: false,
      queryParams: {},
      tableData: [],
      tableThead: [
        {
          label: '总经理部',
          prop: 'projectName',
          minWidth: '180',
          align: 'left',
          checked: true
        },
        {
          label: '工人进退场信息',
          minWidth: '180',
          align: 'center',
          headerAlign: 'center',
          checked: true,
          children: [
            {
              label: '累计情况',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '累计入场',
                  prop: 'accumulatedEnterCount',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '累计退场',
                  prop: 'accumulatedOutCount',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                },
                {
                  label: '当前在场',
                  prop: 'currentOnCount',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '本年情况',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '本年入场',
                  prop: 'yearEnterCount',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '本年退场',
                  prop: 'yearOutCount',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                },
                {
                  label: '本年新增',
                  prop: 'yearAddCount',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            }
          ]
        },
        {
          label: '月工资发放情况',
          minWidth: '180',
          align: 'center',
          headerAlign: 'center',
          checked: true,
          children: [
            {
              label: '2022-01',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleJan',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtJan',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-02',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleFeb',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtFeb',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-03',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleMar',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtMar',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-04',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleApr',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtApr',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-05',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleMay',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtMay',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-06',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleJune',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtJune',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-07',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleJuly',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtJuly',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-08',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleAug',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtAug',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-09',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleSep',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtSep',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-20',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleOct',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtOct',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-11',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleNov',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtNov',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            },
            {
              label: '2022-12',
              minWidth: '120',
              align: 'left',
              checked: true,
              children: [
                {
                  label: '实发人数',
                  prop: 'peopleDec',
                  minWidth: '120',
                  align: 'left',
                  checked: true
                },
                {
                  label: '实发金额',
                  prop: 'amtDec',
                  minWidth: '160',
                  align: 'left',
                  checked: true
                }
              ]
            }
          ]
        }
      ],
      // 表格
      axisArr: [
        // "A1",
        'B1',
        'C1',
        'D1',
        'E1',
        'F1',
        'G1',
        'H1',
        'I1',
        'J1',
        'K1',
        'L1',
        'M1',
        'N1',
        'O1',
        'P1',
        'Q1',
        'R1',
        'S1',
        'T1',
        'U1',
        'V1',
        'W1',
        'X1',
        'Y1',
        'Z1',
        'AA1',
        'AB1',
        'AC1',
        'AD1',
        'AE1',
        'AF1',
        'AG1',
        'AH1',
        'AI1',
        'AJ1',
        'AK1',
        'AL1',
        'AM1',
        'AN1',
        'AO1',
        'AP1',
        'AQ1',
        'AR1',
        'AS1',
        'AT1',
        'AU1',
        'AV1',
        'AW1',
        'AX1',
        'AY1',
        'AZ1'
      ],
      formatterList: {}
    }
  },
  methods: {
    // 高级搜索 start
    enterSearch () {
      this.pageNoCode = 1
      this.formDataSearch = this.formData
      this.localSearchData = JSON.parse(JSON.stringify(this.formData))
      this.getContractList(this.formDataSearch)
    },
    search (searchData) {
      this.pageNoCode = 1
      this.formDataSearch = searchData
      this.localSearchData = JSON.parse(JSON.stringify(searchData))
      this.getContractList(this.formDataSearch)
    },
    // 翻页相关
    handlePrev () {},
    handleNext () {},
    // 每页条数发生改变
    // 每页条数发生改变
    handleSizeChange (val) {
      this.pageNoCode = 1
      if (val !== 'none') {
        this.pageSizeCode = val
      }
      this.getContractList(this.formDataSearch)
    },
    // 当前页发生改变
    handleCurrentChange (val) {
      // 跳转翻页都会调这个方法
      this.pageNoCode = val
      this.getContractList(this.formDataSearch)
    },
    // 导出
    async handleExport (type) {
      // 数据获取接口参数处理 start
      let getData = this.getTableList // 默认擦讯项目数据
      let queryParams = Object.assign({}, this.queryParams) // 默认项目数据条件
      let total = this.total // 默认项目数据总数
      let tableData = this.tableData
      // if (this.activeName == "2") {
      //   // 单位信息
      //   getData = ageDistributionComManagerByOrgId;
      //   queryParams = Object.assign({}, this.orgQueryParams);
      //   total = this.orgTotal;
      //   tableData = this.orgTableData;
      // }
      // 数据获取接口参数处理 end
      // Excel表头处理 start
      const pageHeader1 = [] // 表头第一行
      const pageHeader2 = [] // 表头第二行
      const pageHeader3 = [] // 表头第三行
      const newTableThead = [] // 重新组合的tableThead
      const sheetMerge = [] // 合并单元格配置数据
      const headerList = [] // 有数据的数据列项
      let idx = 0 // 对应列数，对于表头thead数据处理一列（包含子级表头thead），递增
      for (let i = 0; i < this.tableThead.length; i++) {
        const item = this.tableThead[i]
        if (item.children && item.children.length > 0) {
          // 存在第二行子级表头，第一行需要横向合并单元格，根据子级数量合并
          let axisChildList = []
          for (let j = 0; j < item.children.length; j++) {
            const ele = item.children[j]
            if (ele.children && ele.children.length > 0) {
              // 存在第三行子级表头，第二行需要横向合并单元格，根据子级数量合并
              const axisCList = []
              for (let k = 0; k < ele.children.length; k++) {
                const E = ele.children[k]
                E.axisIndex = this.axisArr[idx]
                idx++
                axisCList.push(E.axisIndex)
                headerList.push(E)
                if (j == 0) {
                  pageHeader1.push(item.label)
                } else {
                  pageHeader1.push('')
                }
                if (k == 0) {
                  pageHeader2.push(ele.label)
                } else {
                  pageHeader2.push('')
                }
                pageHeader3.push(E.label)
              }
              axisChildList = [...axisChildList, ...axisCList]
              sheetMerge.push([
                axisCList[0].slice(0, axisCList[0].length - 1) + '2',
                axisCList[axisCList.length - 1].slice(
                  0,
                  axisCList[axisCList.length - 1].length - 1
                ) + '2'
              ])
              newTableThead.push(ele)
            } else {
              // 无第三行子级表头，直接纵向合并第二行单元格和第三行的单元格
              ele.axisIndex = this.axisArr[idx]
              idx++
              newTableThead.push(ele)
              axisChildList.push(ele.axisIndex)
              sheetMerge.push([
                ele.axisIndex.slice(0, ele.axisIndex.length - 1) + '2',
                ele.axisIndex.slice(0, ele.axisIndex.length - 1) + '3'
              ])
              headerList.push(ele)
              pageHeader1.push(item.label)
              pageHeader2.push(ele.label)
              pageHeader3.push('')
            }
          }
          sheetMerge.push([
            axisChildList[0],
            axisChildList[axisChildList.length - 1]
          ])
          newTableThead.push(item)
        } else {
          // 无第二行子级表头，直接纵向合并第一行单元格和第二行的单元格
          item.axisIndex = this.axisArr[idx]
          idx++
          newTableThead.push(item)
          sheetMerge.push([
            item.axisIndex,
            item.axisIndex.slice(0, item.axisIndex.length - 1) + '3'
          ])
          headerList.push(item)
          pageHeader1.push(item.label)
          pageHeader2.push('')
          pageHeader3.push('')
        }
      }
      // 表格数据
      const rowKey = headerList
        .map((obj, index) => {
          return obj.prop
        })
        .join(',')
        .split(',')
      // 表格宽度
      const columns = []
      headerList.forEach(ele => {
        columns.push({
          key: ele.prop,
          width: (ele.minWidth || ele.width) / 10
        })
      })
      // Excel表头处理 end

      const wb = new ExcelJS.Workbook()
      if (type === 'all') {
        const obj = Object.assign({}, queryParams)
        obj.pageSize = (total > 100000 ? 100000 : total) || 5000
        const res = await getData(obj)
        if (res.rows.length > 0) {
          const cutNum = 5000 // 定义分页系数
          const cutRowsList = this.cutArray(res.rows, cutNum) || []
          cutRowsList.forEach((element, idx) => {
            const ws1 = wb.addWorksheet(`第${idx + 1}页`)
            ws1.columns = [{ key: 'id', width: 8 }, ...columns]
            const page1Row1 = ws1.addRow(['序号', ...pageHeader1])
            const page1Row2 = ws1.addRow(['序号', ...pageHeader2])
            const page1Row3 = ws1.addRow(['序号', ...pageHeader3])
            page1Row1.font = { bold: true, color: { argb: '00489A' } }
            page1Row1.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            }
            page1Row2.font = { bold: true, color: { argb: '00489A' } }
            page1Row2.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            }
            page1Row3.font = { bold: true, color: { argb: '00489A' } }
            page1Row3.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            }
            element.forEach((item, index) => {
              const rowList = []
              rowKey.forEach(element => {
                rowList.push(item[element])
              })
              ws1.addRow([cutNum * idx + index + 1, ...rowList])
            })
            ws1.mergeCells('A1', 'A3')
            sheetMerge.forEach(element => {
              ws1.mergeCells(element[0], element[1])
            })
          })
        }
      } else {
        const ws1 = wb.addWorksheet('第1页')
        ws1.columns = [{ key: 'id', width: 8 }, ...columns]
        const page1Row1 = ws1.addRow(['序号', ...pageHeader1])
        const page1Row2 = ws1.addRow(['序号', ...pageHeader2])
        const page1Row3 = ws1.addRow(['序号', ...pageHeader3])
        page1Row1.font = { bold: true, color: { argb: '00489A' } }
        page1Row1.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
        page1Row2.font = { bold: true, color: { argb: '00489A' } }
        page1Row2.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
        page1Row3.font = { bold: true, color: { argb: '00489A' } }
        page1Row3.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
        const exportData = JSON.parse(JSON.stringify(tableData))
        exportData.forEach((item, index) => {
          const rowList = []
          rowKey.forEach(element => {
            rowList.push(item[element])
          })
          ws1.addRow([index + 1, ...rowList])
        })
        ws1.mergeCells('A1', 'A3')
        sheetMerge.forEach(element => {
          ws1.mergeCells(element[0], element[1])
        })
      }
      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), '直属项目情况统计.xlsx')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
