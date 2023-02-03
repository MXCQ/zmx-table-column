import { saveAs } from 'file-saver'
const ExcelJS = require('exceljs')

export default {
  data () {
    return {
      idx: 0,
      pageHeaderList: {}, // 表头数组对象，里面内容是多层分页表头
      headerList: [], // 表头下级，有数据的数据列项
      sheetMerge: [], // 合并单元格配置数据
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
      ]
    }
  },
  methods: {
    // 计算tableThead深度,赋值
    getDeep (data, i, deepArr) {
      // 获取当前结点的子数组，并且打印当前结点的值
      var treeRoot = data.children
      // 如果当前结点没有子数组了（没有子结点）就跳出当前递归,并且使计数器+1，并把计数器i的值存入深度数组中
      if (!treeRoot || (treeRoot && treeRoot.length == 0)) {
        console.log('====================================')
        console.log('末级', i + 1, data.label, this.idx)
        console.log('====================================')
        data.axisIndex = this.axisArr[this.idx]
        // 末级所处层级，后续与最深层级相减计算该节点纵向合并单元格情况
        data.isEnd = i + 1
        // 处理表头数据
        // `pageHeader${data.isEnd}` 判断是否有值，
        // 有值，直接push；
        // 没值，for循环i值，依次提前塞空字符串("")，随后继续push
        if (!this.pageHeaderList[`pageHeader${data.isEnd}`]) {
          this.pageHeaderList[`pageHeader${data.isEnd}`] = []
        }
        for (const key in this.pageHeaderList) {
          const element = this.pageHeaderList[key]
          if (key == `pageHeader${data.isEnd}`) {
            element[this.idx] = data.label
          } else {
            // element[this.idx] = ''
          }
        }
        // this.pageHeaderList[`pageHeader${data.isEnd}`][this.idx] = data.label
        i++
        deepArr.push(i)
        this.idx++
        return
      }
      // 如果当前结点有子数组，就要使计数器+1
      i++
      // 通过for循环来找出每一条路径，对遍历到的结点使用递归
      for (let j = 0; j < treeRoot.length; j++) {
        console.log('====================================')
        console.log('非末级', i, data.label, this.idx)
        console.log('====================================')
        if (!this.pageHeaderList[`pageHeader${i}`]) {
          this.pageHeaderList[`pageHeader${i}`] = []
        }
        this.pageHeaderList[`pageHeader${i}`][this.idx] = data.label
        this.getDeep(treeRoot[j], i, deepArr) // 递归时传入的就是当前结点的第j个子结点，当这第j个子结点中的所有子孙结点全部遍历完成之后，再去遍历第j+1个结点的所有子孙结点
      }
    },
    // 导出
    async handleExport1 (type) {
      let deepArr = [] // 定义存放每条路径深度的数组
      let i = 0
      for (let j = 0; j < this.tableThead.length; j++) {
        this.getDeep(this.tableThead[j], i, deepArr) // 递归时传入的就是当前结点的第j个子结点，当这第j个子结点中的所有子孙结点全部遍历完成之后，再去遍历第j+1个结点的所有子孙结点
      }
      // this.getDeep(this.tableThead, 0, deepArr)
      console.log('====================================')
      console.log(this.tableThead, deepArr, this.pageHeaderList)
      console.log('====================================')
      // return
      // 数据获取接口参数处理 start
      let getData = this.getTableList // 默认擦讯项目数据
      let queryParams = Object.assign({}, this.queryParams) // 默认项目数据条件
      let total = this.total // 默认项目数据总数
      let tableData = this.tableData
      // 数据获取接口参数处理 end
      // Excel表头处理 start
      const pageHeader1 = this.pageHeaderList.pageHeader1 // 表头第一行
      const pageHeader2 = this.pageHeaderList.pageHeader2 // 表头第二行
      const pageHeader3 = this.pageHeaderList.pageHeader3 // 表头第三行
      const sheetMerge = [] // 合并单元格配置数据
      const headerList = [] // 有数据的数据列项
      // for (let i = 0; i < this.tableThead.length; i++) {
      //   const item = this.tableThead[i]
      //   this.pageHeaderFormatter(item, 0)
      // }
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
      saveAs(new Blob([buf]), '测试表格.xlsx')
    },

    // 循环定义数据
    pageHeaderFormatter (data, i) {
      if (data.children && data.children.length > 0) {
        this.sheetMerge.push(
          this.axisArr[this.idx],
          this.axisArr[this.idx + data.children.length]
        )
        for (let index = 0; index < data.children.length; index++) {
          const element = data.children[index]
          this.pageHeaderFormatter(element, i + 1)
        }
      } else {
        data.axisIndex = this.axisArr[this.idx]
        this.idx++
        this.headerList.push(data)
        this.pageHeaderList[`pageHeader${i}`].push(data.label)
      }
    }
  }
}
