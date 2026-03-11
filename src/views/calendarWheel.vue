<!-- <template>
  <el-calendar v-model="value">
    <template slot="dateCell" slot-scope="data">
      <template v-if="isHighlighted(data.date)" class="highlighted-date">
        <div class="highlighted-date">{{ data.date.getDate() }}</div>
      </template>
      <template v-else>
        <div>{{ data.date.getDate() }}</div>
      </template>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      highlightedDates: ['2024-01-10', '2024-01-15', '2024-01-20'] // 指定的日期数组
    };
  },
  methods: {
    isHighlighted(date) {
      const formattedDate = this.formatDate(date);
      return this.highlightedDates.includes(formattedDate);
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
  .highlighted-date {
    background-color: #ffcc00; /* 设置指定日期的背景颜色 */
    width: 100%;
    height: 100%;
  }
</style> -->




<!-- <template>
  <div>
    <el-calendar v-model="value" :start-date="startDate" :end-date="endDate"></el-calendar>
    <el-button @click='changeDateRange()'>点击切换时间</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      startDate: new Date('2022-01-01'),  // 设置开始日期
      endDate: new Date('2022-12-31')  // 设置结束日期
    };
  },
  methods: {
    changeDateRange() {
      // 在需要的时候通过方法动态改变日期范围
      this.startDate = new Date('2023-01-01');
      this.endDate = new Date('2023-12-31');
    }
  }
};
</script> -->



<!-- <template>
  <div>
    <v-date-picker v-model="selectedDate"></v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null
    };
  }
};
</script> -->

<template>
  <v-calendar
    v-model="selectedDate"
    type="year"
  />
</template>

<script>
import VCalendar from 'v-calendar';

export default {
  components: {
    VCalendar,
  },
  data() {
    return {
      selectedDate: new Date(), // 设置选中的日期
    };
  },
};
</script>

