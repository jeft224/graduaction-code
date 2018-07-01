<template>
  <Card style="height: 600px">
    <section class="chart">
      <Row type='flex'>
        <Col :span="12">
          <div id="chartColumn" style="width:660px; height:400px;"></div>
        </Col>
        <Col :span="12">
          <div id="chartLine" style="width:100%; height:400px;"></div>
        </Col>
      </Row>
    </section>
  </Card>
</template>

<script>
  import echarts from 'echarts'

  export default{
    data (){
      return {
        chartColumn:null,
        chartBar:null,
        chartLine:null,
        chartPie:null
      }
    },
    mounted:function(){
      var _this=this;
      //基于准备好的dom，初始化echarts实例
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));
      this.chartLine = echarts.init(document.getElementById('chartLine'));

      this.chartColumn.setOption({
        title: { text: '商品类别销量' },
        tooltip: {},
        xAxis: {
          data: ["手机","笔记本","路由器","电视机","智能硬件","耳机"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 11, 12, 9, 8,18]
        }]
      });

      this.chartLine.setOption({
        title: {
          text: '个别商品销量走势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['手机','笔记本','电视机']
        },
        grid: {
          left: '0%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'手机',
            type:'line',
            stack: '总量',
            data:[15, 10, 9, 10, 11, 12, 20]
          },
          {
            name:'笔记本',
            type:'line',
            stack: '总量',
            data:[20, 2, 11, 14, 19, 23, 20]
          },
          {
            name:'电视机',
            type:'line',
            stack: '总量',
            data:[20, 32, 60, 34, 60, 30, 20]
          }
        ]
      });
    }

  }
</script>

<style scoped>
  .chart {
    width: 100%;
    /* float: left; */
  }

  .Col {
    /* padding: 30px 20px; */
  }
</style>
