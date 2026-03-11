<template>
  <div class="gold-price-dashboard">
    <div class="header">
      <h1>今日金价</h1>
    </div>

    <!-- 银行金条价格 -->
    <div class="section">
      <h2 class="section-title">
        <i class="el-icon-bank-card"></i>
        银行金条价格
      </h2>
      <el-table :data="bankGoldBarPrices" style="width: 100%" stripe border>
        <el-table-column prop="bank" label="银行/金条名称" width="250">
          <template slot-scope="scope">
            <div class="bank-name">
              <i class="el-icon-office-building"></i>
              {{ scope.row.bank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格(元/克)">
          <template slot-scope="scope">
            <span class="price-highlight">{{ formatPrice(scope.row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleBuy(scope.row)">
              购买
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="stats">
        <span>最低价: {{ getMinBankPrice() }}元/克</span>
        <span>最高价: {{ getMaxBankPrice() }}元/克</span>
        <span>平均价: {{ getAvgBankPrice() }}元/克</span>
      </div>
    </div>

    <!-- 黄金回收价格 -->
    <div class="section">
      <h2 class="section-title">
        <i class="el-icon-refresh"></i>
        贵金属回收价格
      </h2>
      <el-table :data="latestRecyclePrices" style="width: 100%" stripe border>
        <el-table-column prop="gold_type" label="金属类型" width="200">
          <template slot-scope="scope">
            <div class="metal-type">
              <i class="el-icon-coin" v-if="scope.row.gold_type.includes('金')"></i>
              <i class="el-icon-c-scale-to-original" v-else-if="scope.row.gold_type.includes('银')"></i>
              <i class="el-icon-star-off" v-else></i>
              {{ scope.row.gold_type }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="recycle_price" label="回收价格(元/克)">
          <template slot-scope="scope">
            <span :class="getRecyclePriceClass(scope.row.gold_type)">
              {{ formatPrice(scope.row.recycle_price) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updated_date" label="更新日期" width="150">
          <template slot-scope="scope">
            <el-tag size="small" :type="isLatestDate(scope.row.updated_date) ? 'success' : 'info'">
              {{ scope.row.updated_date }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 品牌贵金属价格 -->
    <div class="section">
      <h2 class="section-title">
        <i class="el-icon-gold-medal"></i>
        品牌珠宝首饰价格
      </h2>
      <el-table :data="preciousMetalPrices" style="width: 100%" stripe border>
        <el-table-column prop="brand" label="品牌" width="150">
          <template slot-scope="scope">
            <div class="brand-name">
              <img :src="getBrandLogo(scope.row.brand)" :alt="scope.row.brand" class="brand-logo" />
              {{ scope.row.brand }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gold_price" label="黄金(元/克)">
          <template slot-scope="scope">
            <span v-if="scope.row.gold_price !== '-'" class="gold-price">
              {{ formatPrice(scope.row.gold_price) }}
            </span>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="bullion_price" label="投资金条(元/克)">
          <template slot-scope="scope">
            <span v-if="scope.row.bullion_price !== '-'" class="bullion-price">
              {{ formatPrice(scope.row.bullion_price) }}
            </span>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="platinum_price" label="铂金(元/克)">
          <template slot-scope="scope">
            <span v-if="scope.row.platinum_price !== '-'" class="platinum-price">
              {{ formatPrice(scope.row.platinum_price) }}
            </span>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="updated_date" label="更新日期" width="150">
          <template slot-scope="scope">
            {{ scope.row.updated_date }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'GoldPriceDisplay',
  data() {
    return {
      apiData: {
        bank_gold_bar_price: [],
        gold_recycle_price: [],
        precious_metal_price: []
      },
      // 模拟的品牌logo映射，实际项目中应该使用真实logo URL
      brandLogos: {
        '周六福': 'https://www.zlf.cn/public/profile/img/2026/01/05/LOGO（168×80px)_20260105005445A028.png',
        '中国黄金': 'https://www.chinagoldgroup.com/zghj/lib/home/picture/logo.jpg',
        '老凤祥': 'https://www.laofengxiang.com/images/logo.png',
        '老庙黄金': 'http://www.43ppw.com/UploadFile/CoolSite/2023-10/2023100302014755.gif',
        '菜百首饰': 'https://image.caibaivip.cn/84b3e47241c8daeeee6ea6466fbd70d9.png',
        '潮宏基': 'https://www.chjchina.com/uploads/20250711/fa5afe61460bcc617a009370e974ee73.png',
        '金至尊': 'https://www.3dg-group.com/images/Navi_logo.png',
        '谢瑞麟': 'https://expo.wto168.net/newWeb/uploads/userup/6007/comface.png',
        '六福珠宝': 'https://www.lukfook.com/assets/static/images/common/logo.svg?v=202601042',
        '周生生': 'https://cn.chowsangsang.com/images/css.png',
        '周大福': 'https://bkimg.cdn.bcebos.com/pic/b21c8701a18b87d6277f356b56513f381f30e9245737?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080'
      }
    };
  },

  computed: {
    bankGoldBarPrices() {
      return this.apiData.bank_gold_bar_price || [];
    },

    goldRecyclePrices() {
      return this.apiData.gold_recycle_price || [];
    },

    preciousMetalPrices() {
      return this.apiData.precious_metal_price || [];
    },

    // 获取最新的回收价格（过滤掉历史数据）
    latestRecyclePrices() {
      const prices = this.goldRecyclePrices;
      const latestDate = this.getLatestDate(prices);

      return prices.filter(item => item.updated_date === latestDate);
    }
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      try {
        // 这里应该是实际的API调用
        const response = await axios.get(`https://v2.xxapi.cn/api/goldprice`)
        console.log("response === ", response)
        this.apiData = response.data.data;
        this.$message.success('数据加载成功');
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('数据加载失败，请稍后重试');
      }
    },

    formatPrice(price) {
      if (!price || price === '-') return '-';
      return parseFloat(price).toFixed(2);
    },

    getLatestDate(prices) {
      if (!prices || prices.length === 0) return '';
      const dates = prices.map(item => item.updated_date);
      return dates.reduce((latest, current) =>
        new Date(current) > new Date(latest) ? current : latest
      );
    },

    isLatestDate(date) {
      const latestDate = this.getLatestDate(this.goldRecyclePrices);
      return date === latestDate;
    },

    getRecyclePriceClass(goldType) {
      if (goldType.includes('24K金') || goldType.includes('黄金回收')) {
        return 'gold-price-high';
      } else if (goldType.includes('18K金')) {
        return 'gold-price-medium';
      } else if (goldType.includes('14K金')) {
        return 'gold-price-low';
      } else if (goldType.includes('钯金')) {
        return 'palladium-price';
      } else {
        return 'silver-price';
      }
    },

    getBrandLogo(brand) {
      return this.brandLogos[brand] || 'https://via.placeholder.com/20x20/ccc/666?text=品';
    },

    handleBuy(item) {
      this.$confirm(`确定要购买【${item.bank}】吗？`, '确认购买', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$message.success(`已提交购买${item.bank}的申请`);
      }).catch(() => {
        // 用户取消
      });
    },

    getMinBankPrice() {
      if (this.bankGoldBarPrices.length === 0) return '0.00';
      const prices = this.bankGoldBarPrices.map(item => parseFloat(item.price));
      return Math.min(...prices).toFixed(2);
    },

    getMaxBankPrice() {
      if (this.bankGoldBarPrices.length === 0) return '0.00';
      const prices = this.bankGoldBarPrices.map(item => parseFloat(item.price));
      return Math.max(...prices).toFixed(2);
    },

    getAvgBankPrice() {
      if (this.bankGoldBarPrices.length === 0) return '0.00';
      const prices = this.bankGoldBarPrices.map(item => parseFloat(item.price));
      const sum = prices.reduce((acc, cur) => acc + cur, 0);
      return (sum / prices.length).toFixed(2);
    }
  }
};
</script>

<style scoped>
.gold-price-dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.last-updated {
  color: #909399;
  font-size: 14px;
}

.section {
  margin-bottom: 40px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #409eff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metal-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.price-highlight {
  color: #e6a23c;
  font-weight: bold;
  font-size: 16px;
}

.gold-price {
  color: #e6a23c;
  font-weight: bold;
}

.bullion-price {
  color: #f56c6c;
  font-weight: bold;
}

.platinum-price {
  color: #909399;
  font-weight: bold;
}

.gold-price-high {
  color: #e6a23c;
  font-weight: bold;
}

.gold-price-medium {
  color: #f56c6c;
  font-weight: bold;
}

.gold-price-low {
  color: #67c23a;
  font-weight: bold;
}

.palladium-price {
  color: #909399;
  font-weight: bold;
}

.silver-price {
  color: #c0c4cc;
  font-weight: bold;
}

.no-data {
  color: #c0c4cc;
  font-style: italic;
}

.stats {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
}

.stats span {
  color: #606266;
}

.stats span:nth-child(1) {
  color: #67c23a;
}

.stats span:nth-child(2) {
  color: #f56c6c;
}

.stats span:nth-child(3) {
  color: #409eff;
}
</style>