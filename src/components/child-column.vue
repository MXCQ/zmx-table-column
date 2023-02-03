<template>
  <div>
    <template v-if="children && children.length > 0">
      <el-table-column
        v-for="(table) in children"
        :fixed="table.fixed || false"
        :key="table.label"
        :type="table.type"
        :label="table.label"
        :align="table.align || 'center'"
        :header-align="table.headerAlign || 'center'"
        :min-width="table.minWidth"
        :prop="table.prop"
        :formatter="formatterList[table.formatterName]"
        :show-overflow-tooltip="true"
      >
        <template v-if="table.children && table.children.length > 0">
          <el-table-column width="1"></el-table-column>
          <child-column :key="table.label" :children="table.children"> </child-column>
        </template>
      </el-table-column>
    </template>
  </div>
</template>

<script>
export default {
  name: 'child-column',
  props: {
    children: {
      type: Array,
      default: () => {
        return []
      }
    },
    formatterList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
