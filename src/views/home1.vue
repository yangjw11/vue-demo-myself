<template>
  <div id="home">
    <!-- 本部分内容向 杨阳 同志致敬，感谢 杨阳 同志为本部分做出的杰出贡献 -->
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
  export default {
    name: 'home1',
    data() {
      return {
        autoRotationSpeed: 0,
        autoRotationAxis: null,
        sphere: null,
        scene: null,
        camera: null,
        mouse: null,
        textSpeed: 0,
        raycaster: null,
        renderer: null,
        isDragging: false,
        previousMousePosition: null,
        lastDragDelta: null,
        currentAngularVelocity: null,
        sphereGeometry: null,
        sphereMaterial: null,
        labelSprites: [],
        decayRate: 0.92,
        increaseRate: 1.02,
        smallBalls: [],
        data: [
          { path: '/antiShake', name: '【防抖节流demo】' },
          { path: '/cascader', name: '【级联选择器demo】' },
          { path: '/dateTimePicker', name: '【时间日期选择器】' },
          { path: '/nextTick', name: '【vue中的nextTick方法】' },
          { path: '/computed', name: '【vue中的computed属性】' },
          { path: '/globalMethods', name: '【vue中封装公共方法】' },
          { path: '/compHome', name: '【vue中组件通信】' },
          { path: '/vuex/vuexHome', name: '【vuex的使用】' },
          { path: '/directive', name: '【vue自定义指令】' },
          { path: '/inputCheck', name: '【vue简单输入框校验】' },
          { path: '/animation', name: '【vue简单动画效果】' },
          { path: '/commonCopt', name: '【vue公共组件的封装】' },
          { path: '/commonCopt1', name: '【vue公共组件的封装1】' },
          { path: '/regularExpress', name: '【正则表达式的学习】' },
          { path: '/richTextEditor', name: '【富文本编辑器】' },
          { path: '/elSwitch', name: '【elementUI的switch开关】' },
          { path: '/dragDrop', name: '【vue的拖曳功能】' },
          { path: '/elTableCellStyle', name: '【vue动态改变elementUI的单元格样式】' },
          { path: '/keyboardEvent', name: '【vue的键盘事件】' },
          { path: '/slotUseA', name: '【vue插槽slot的使用】' },
          { path: 'canvas', name: '【vue中canvas画布的使用】' },
          { path: '/interfaceDemo', name: '【vue接口练习demo】' },
          { path: '/treeTable', name: '【表格中树形控件】' },
          { path: '/shortComing2.0', name: '【vue2.x版本响应式原理存在的问题】' },
          { path: '/elementUI_filter', name: '【elementUI表格过滤器的使用】' },
          { path: '/elementUI_tree', name: '【elementUI树形控件】' },
          { path: 'vueTreeselect', name: '【vue-treeselect插件的使用】' },
          { path: '/demoTree', name: '【CBB项目树形控件练习】' },
          { path: '/globalStyle', name: '【全局样式页使用】' },
          { path: '/vmfatherSon', name: '【父子组件使用v-model传值】' },
          { path: '/skinPeeler', name: '【换肤功能】' },
          { path: '/EchartsTest', name: '【Echarts图表示例】' },
          { path: '/uploadPDF', name: '【PDF上传下载预览】' },
          { path: '/selfCall', name: '【组件自己调用自己】' },
          { path: '/elementUIMenu', name: '【elementUI菜单组件】' },
          { path: '/finalTime', name: '【点击按钮倒计时功能】' },
          { path: '/rate', name: '【elementUI的Rate评分】' },
          { path: '/axiosFree', name: '【axios调用免费接口】' },
          { path: '/iframe', name: '【iframe嵌套外部页面】' },
          { path: '/duoleSet', name: '【this.$set使用详解】' },
          { path: '/dragDialog', name: '【弹窗拖动，双击放大功能】' },
          { path: '/mapGaud', name: '【高德地图练习】' },
          { path: '/mapBaidu', name: '【百度地图练习】' },
          { path: '/testCom', name: '【测试父子组件传值】' },
          { path: '/anchorPoint', name: '【锚点定位功能】' },
          { path: '/EchartCom', name: '【Echarts图表在vue中封装成公共组件】' },
          { path: '/merge_cell', name: '【elementUI合并单元格】' },
          { path: '/scatterPlot', name: '【Echarts散点图demo】' },
          { path: '/heatMap', name: '【Echarts热力图demo】' },
          { path: '/filter_el_table', name: '【elementUI 可以筛选的表格】' },
          { path: '/render', name: '【render方法的使用】' },
          { path: '/selectQuarter', name: '【季度选择器】' },
          { path: '/sync', name: '【vue中.sync修饰符】' },
          { path: '/magnifier', name: '【vue中实现淘宝放大镜功能】' },
          { path: '/girlAxiosFree', name: '【获取美女图片】' },
          { path: '/testMagnifier', name: '【放大镜功能拆分】' },
          { path: '/uploadPDF2', name: '【页面生成pdf文件】' },
          { path: '/calendarWheel', name: '【日历组件】' },
          { path: '/compUseIs', name: '【组件标签中的 is 关键字】' },
          { path: '/hardRules', name: '【复杂的表单校验】' },
          { path: '/transition', name: '【transition 标签的使用】' },
          { path: '/lodashStudy', name: '【lodash库 使用示例】' },
          { path: '/forceUpdate', name: '【forceUpdate 使用示例】' },
          { path: '/weatherForecast', name: '【天气预报】' },
          { path: '/getGirlVideo', name: '【小姐姐视频】' },
          { path: '/swiperDemo', name: '【swiper插件练习】' },
          { path: '/weatherAndMap', name: '【地图和天气预报结合】' },
          { path: '/weatherAndMapPro', name: '【地图和天气预报的结合经纬度】' },
          { path: '/OneDayEnglish', name: '【每日英文】' },
          { path: '/ceiling', name: 'ElementUI表格固定列表头吸顶' },
          { path: '/page1', name: '【页面内守卫】' },
          { path: '/zzz', name: '【草稿练习页】' }
        ],
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        // 创建场景
        this.scene = new THREE.Scene()

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        )
        this.camera.position.set(0, 0, 14)
        this.camera.lookAt(0, 0, 0)

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(0x000000, 0)
        document.body.appendChild(this.renderer.domElement)

        // 创建半透明球体
        this.sphereGeometry = new THREE.SphereGeometry(4.85, 16, 16)
        this.sphereMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0x000000) },
            opacity: { value: 0.8 },
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying vec3 vNormal;
            void main() {
                float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
                gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          side: THREE.FrontSide,
          depthWrite: false,
        })

        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)
        this.scene.add(this.sphere)

        // 创建小球体和标签数组
        const smallBallGeometry = new THREE.SphereGeometry(0.15, 16, 16)
        this.smallBalls = []
        this.labelSprites = []

        const radius = 5
        const numPoints = 88
        const goldenRatio = (1 + Math.sqrt(5)) / 2
        const maxWidth = 160
        this.textSpeed = 0.002

        // 创建射线投射器
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2
        const radiusAtY = Math.sqrt(1 - y * y)

        const theta = (2 * Math.PI * i) / goldenRatio

        const x = Math.cos(theta) * radiusAtY
        const z = Math.sin(theta) * radiusAtY
        const smallBallMaterial = new THREE.MeshBasicMaterial({
          color: this.getRandomBrightColor(),
          depthWrite: true,
          depthTest: true,
          side: THREE.FrontSide,
        })
        const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial)
        smallBall.position.set(x * radius, y * radius, z * radius)
        this.sphere.add(smallBall)
        this.smallBalls.push(smallBall)

        const labelText = this.getRandomNickname()
        const { texture, needMarquee, HWRate } = this.createTextTexture(labelText, {
          fontSize: 28,
          fontFace: 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
          textColor: '#bbbbbb',
          maxWidth: maxWidth,
        })

        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: true,
          depthTest: true,
          blending: THREE.NormalBlending,
        })

        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.scale.set(1, HWRate, 1)
        this.labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText })
        this.scene.add(sprite)
      }

      // 添加灯光
      const light = new THREE.AmbientLight(0xffffff, 0.5)
      this.scene.add(light)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      this.scene.add(directionalLight)

      // 定义自动旋转速度和轴
      this.autoRotationSpeed = 0.0005
      this.autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize()
      this.currentAngularVelocity = this.autoRotationAxis.clone().multiplyScalar(this.autoRotationSpeed)

      
      this.previousMousePosition = { x: 0, y: 0 }
      this.lastDragDelta = { x: 0, y: 0 }


        // 事件监听
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('touchstart', this.onTouchStart)
        window.addEventListener('touchmove', this.onTouchMove)
        window.addEventListener('touchend', this.onTouchEnd)
        document.addEventListener('gesturestart', function (e) {
          e.preventDefault()
        })

        // 添加点击事件监听
        window.addEventListener('click', this.onMouseClick)

        // 处理窗口大小调整
        window.addEventListener('resize', () => {
          this.camera.aspect = window.innerWidth / window.innerHeight
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(window.innerWidth, window.innerHeight)
        })

        this.animate()

      },
      createTextTexture(text, parameters = {}) {
        const {
          fontSize = 24,
          fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
          textColor = 'white',
          backgroundColor = 'rgba(0,0,0,0)',
          maxWidth = 160,
        } = parameters

        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        context.font = `${fontSize}px ${fontFace}`

        const textMetrics = context.measureText(text)
        const textWidth = Math.ceil(textMetrics.width)
        const textHeight = fontSize * 1.2

        const needMarquee = textWidth > maxWidth

        let canvasWidth = maxWidth
        if (needMarquee) {
          canvasWidth = textWidth + 60
        }

        canvas.width = canvasWidth
        canvas.height = textHeight
        context.font = `${fontSize}px ${fontFace}`
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = backgroundColor
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = textColor
        context.textAlign = needMarquee ? 'left' : 'center'
        context.textBaseline = 'middle'

        if (needMarquee) {
          context.fillText(text, 0, canvas.height / 2)
        } else {
          context.fillText(text, maxWidth / 2, canvas.height / 2)
        }

        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true

        if (needMarquee) {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.repeat.x = maxWidth / canvas.width
        } else {
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
        }

        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false
        return { texture, needMarquee, HWRate: textHeight / maxWidth }
      },
      checkIntersection() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.smallBalls)

        if (intersects.length > 0) {
          const intersectedBall = intersects[0].object
          const index = this.smallBalls.indexOf(intersectedBall)
          if (index !== -1) {
            const labelInfo = this.labelSprites[index]
            this.showLabelInfo(labelInfo)
          }
        }
      },
      showLabelInfo(labelInfo) {
        const text = labelInfo.labelText;
        const { path } = this.data.filter((item) => item.name === text)[0];
        this.$router.push({
				  path: path
			  });
        
      },
      // 动画循环
      animate() {
        requestAnimationFrame(this.animate)

        if (!this.isDragging) {
          const deltaQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              this.currentAngularVelocity.x,
              this.currentAngularVelocity.y,
              this.currentAngularVelocity.z,
              'XYZ'
            )
          )
          this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion)

          const currentSpeed = this.currentAngularVelocity.length()

          if (currentSpeed > this.autoRotationSpeed) {
            this.currentAngularVelocity.multiplyScalar(this.decayRate)

            if (this.currentAngularVelocity.length() < this.autoRotationSpeed) {
              this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed)
            }
          } else if (currentSpeed < this.autoRotationSpeed) {
            this.currentAngularVelocity.multiplyScalar(this.increaseRate)

            if (this.currentAngularVelocity.length() > this.autoRotationSpeed) {
              this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed)
            }
          } else {
            this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed)
          }
        }

        // 更新标签的位置和跑马灯效果
        this.labelSprites.forEach(({ sprite, smallBall, texture, needMarquee }) => {
          smallBall.updateMatrixWorld()
          const smallBallWorldPos = new THREE.Vector3()
          smallBall.getWorldPosition(smallBallWorldPos)

          const upOffset = new THREE.Vector3(0, 0.3, 0)

          sprite.position.copy(smallBallWorldPos).add(upOffset)

          if (needMarquee) {
            texture.offset.x += this.textSpeed

            if (texture.offset.x > 1) {
              texture.offset.x = 0
            }
          }
        })

        this.renderer.render(this.scene, this.camera)
      },
      getRandomBrightColor() {
        const hue = Math.floor(Math.random() * 360)
        const saturation = Math.floor(Math.random() * 40 + 10)
        const lightness = Math.floor(Math.random() * 40 + 40)

        const rgb = this.hslToRgb(hue, saturation, lightness)

        return (rgb.r << 16) | (rgb.g << 8) | rgb.b
      },
      hslToRgb(h, s, l) {
        s /= 100
        l /= 100

        const c = (1 - Math.abs(2 * l - 1)) * s
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
        const m = l - c / 2

        let r, g, b
        if (h >= 0 && h < 60) {
          r = c
          g = x
          b = 0
        } else if (h >= 60 && h < 120) {
          r = x
          g = c
          b = 0
        } else if (h >= 120 && h < 180) {
          r = 0
          g = c
          b = x
        } else if (h >= 180 && h < 240) {
          r = 0
          g = x
          b = c
        } else if (h >= 240 && h < 300) {
          r = x
          g = 0
          b = c
        } else {
          r = c
          g = 0
          b = x
        }

        return {
          r: Math.round((r + m) * 255),
          g: Math.round((g + m) * 255),
          b: Math.round((b + m) * 255),
        }
      },
      getRandomNickname() {
        const nickname = this.data[Math.floor(Math.random() * this.data.length)].name
        if (nickname.length < 2) {
          return this.getRandomNickname()
        } else if (nickname.length > 22) {
          return nickname.slice(0, 22)
        }
        return nickname
      },
      // 鼠标事件处理
      onMouseDown(event) {
        this.isDragging = true
        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        }
      },
      onMouseMove(event) {
        if (this.isDragging) {
          const deltaX = event.clientX - this.previousMousePosition.x
          const deltaY = event.clientY - this.previousMousePosition.y

          this.lastDragDelta = { x: deltaX, y: deltaY }

          const rotationFactor = 0.005

          const angleY = deltaX * rotationFactor
          const angleX = deltaY * rotationFactor

          const quaternionY = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            angleY
          )
          const quaternionX = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            angleX
          )

          const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX)

          this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion)

          const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
          const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor

          if (dragRotationAxis.length() > 0) {
            this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed)
          }

          this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
          }
        }
      },
      onMouseUp() {
        if (this.isDragging) {
          this.isDragging = false

          const deltaX = this.lastDragDelta.x
          const deltaY = this.lastDragDelta.y

          if (deltaX !== 0 || deltaY !== 0) {
            const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
            if (newAxis.length() > 0) {
              this.autoRotationAxis.copy(newAxis)
            }

            const dragSpeed = this.currentAngularVelocity.length()
            if (dragSpeed > this.autoRotationSpeed) {
              // 维持当前旋转速度
            } else {
              this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed)
            }
          }
        }
      },
      // 触摸事件处理
      onTouchStart(event) {
        this.isDragging = true
        const touch = event.touches[0]
        this.previousMousePosition = {
          x: touch.clientX,
          y: touch.clientY,
        }
      },
      onTouchMove(event) {
        event.preventDefault()
        if (this.isDragging) {
          const touch = event.touches[0]
          const deltaX = touch.clientX -this.previousMousePosition.x
          const deltaY = touch.clientY - this.previousMousePosition.y

          this.lastDragDelta = { x: deltaX, y: deltaY }

          const rotationFactor = 0.002

          const angleY = deltaX * rotationFactor
          const angleX = deltaY * rotationFactor

          const quaternionY = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            angleY
          )
          const quaternionX = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            angleX
          )

          const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX)

          this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion)

          const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
          const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor

          if (dragRotationAxis.length() > 0) {
            this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed)
          }

          this.previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY,
          }
        }
      },
      onTouchEnd(event) {
        if (this.isDragging) {
          this.isDragging = false

          const deltaX = this.lastDragDelta.x
          const deltaY = this.lastDragDelta.y

          if (deltaX !== 0 || deltaY !== 0) {
            const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
            if (newAxis.length() > 0) {
              this.autoRotationAxis.copy(newAxis)
            }

            const dragSpeed = this.currentAngularVelocity.length()
            if (dragSpeed > this.autoRotationSpeed) {
              // 维持当前旋转速度
            } else {
              this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed)
            }
          }
        }

        // 检查点击事件
        if (event.changedTouches.length > 0) {
          const touch = event.changedTouches[0]
          this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
          this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1
          this.checkIntersection()
        }
      },
      onMouseClick(event) {
        event.preventDefault()
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        // console.log(event.clientX, this.mouse.x, this.mouse.y)

        this.checkIntersection()
      }
    }
  }
</script>

<style lang="scss" scoped>
#home {
  margin: 0;
  padding: 0;
  background-color: black;
  touch-action: none;
}
canvas {
  display: block;
}
</style>