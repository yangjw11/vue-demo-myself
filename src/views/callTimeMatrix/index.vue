<template>
  <div id="app">
    <call-time-config ref="callTimeConfig" @cancel="handleCancel" @submit="handleSubmit"
      @submit-and-call="handleSubmitAndCall" :initialConfig="initialConfig" />
  </div>
</template>

<script>
import CallTimeConfig from './components/CallTimeConfig.vue';

export default {
  name: 'App',
  components: {
    CallTimeConfig
  },
  data() {
    return {
      initialConfig: {
        scheduledTime: [
          {
            "dayOfWeeks": [
              1
            ],
            "times": [
              {
                "startTime": "09:00",
                "endTime": "10:30"
              },
              {
                "startTime": "11:00",
                "endTime": "12:30"
              },
              {
                "startTime": "13:00",
                "endTime": "15:30"
              },
              {
                "startTime": "16:00",
                "endTime": "17:30"
              },
              {
                "startTime": "18:00",
                "endTime": "19:30"
              }
            ]
          },
          {
            "dayOfWeeks": [
              2
            ],
            "times": [
              {
                "startTime": "09:00",
                "endTime": "09:30"
              },
              {
                "startTime": "10:00",
                "endTime": "12:00"
              },
              {
                "startTime": "12:30",
                "endTime": "14:30"
              },
              {
                "startTime": "15:00",
                "endTime": "16:00"
              },
              {
                "startTime": "16:30",
                "endTime": "18:00"
              },
              {
                "startTime": "19:00",
                "endTime": "19:30"
              }
            ]
          },
          {
            "dayOfWeeks": [
              3
            ],
            "times": [
              {
                "startTime": "08:00",
                "endTime": "10:30"
              },
              {
                "startTime": "11:00",
                "endTime": "13:30"
              },
              {
                "startTime": "14:00",
                "endTime": "17:30"
              },
              {
                "startTime": "18:00",
                "endTime": "18:30"
              },
              {
                "startTime": "19:00",
                "endTime": "19:30"
              }
            ]
          },
          {
            "dayOfWeeks": [
              4
            ],
            "times": [
              {
                "startTime": "08:00",
                "endTime": "08:30"
              },
              {
                "startTime": "09:00",
                "endTime": "10:00"
              },
              {
                "startTime": "10:30",
                "endTime": "14:30"
              },
              {
                "startTime": "15:00",
                "endTime": "16:30"
              },
              {
                "startTime": "17:00",
                "endTime": "19:30"
              }
            ]
          },
          {
            "dayOfWeeks": [
              5
            ],
            "times": [
              {
                "startTime": "08:30",
                "endTime": "09:30"
              },
              {
                "startTime": "10:00",
                "endTime": "11:00"
              },
              {
                "startTime": "11:30",
                "endTime": "12:30"
              },
              {
                "startTime": "13:00",
                "endTime": "15:30"
              },
              {
                "startTime": "16:00",
                "endTime": "18:00"
              },
              {
                "startTime": "18:30",
                "endTime": "19:00"
              }
            ]
          },
          {
            "dayOfWeeks": [
              6
            ],
            "times": [
              {
                "startTime": "08:30",
                "endTime": "09:30"
              },
              {
                "startTime": "10:00",
                "endTime": "11:00"
              },
              {
                "startTime": "11:30",
                "endTime": "12:00"
              },
              {
                "startTime": "12:30",
                "endTime": "13:30"
              },
              {
                "startTime": "14:30",
                "endTime": "16:30"
              },
              {
                "startTime": "17:30",
                "endTime": "18:30"
              }
            ]
          },
          {
            "dayOfWeeks": [
              7
            ],
            "times": [
              {
                "startTime": "10:30",
                "endTime": "13:30"
              },
              {
                "startTime": "14:30",
                "endTime": "15:30"
              },
              {
                "startTime": "16:00",
                "endTime": "16:30"
              },
              {
                "startTime": "17:30",
                "endTime": "18:00"
              },
              {
                "startTime": "18:30",
                "endTime": "19:00"
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    handleCancel() {
      console.log('用户取消了配置');
      alert('已取消配置');
    },

    handleSubmit(config) {
      console.log('提交的配置数据:', config);
      // 这里可以发送配置到后端API
      // 示例：
      // axios.post('/api/call-task/config', config)
      //   .then(response => {
      //     console.log('配置保存成功:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('配置保存失败:', error);
      //   });
    },

    handleSubmitAndCall(config) {
      console.log('提交并外呼的配置数据:', config);
      // 这里可以发送配置到后端API并启动外呼任务
      // 示例：
      // axios.post('/api/call-task/start', config)
      //   .then(response => {
      //     console.log('外呼任务已启动:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('启动外呼任务失败:', error);
      //   });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
}
</style>