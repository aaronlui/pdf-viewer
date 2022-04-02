<template>
  <div id="app">
    <el-scrollbar ref="scrollbar" v-loading="loading" class="scrollbar">
      <template v-for="index in canvasSize">
        <canvas ref="canvas" :key="index"></canvas>
      </template>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      pdf: null,
      pageSize: 0,
      canvasSize: 1,
      pageNum: 1,
      loading: false
    }
  },
  async created() {
    const url = '/English.pdf'
    this.readPdf(url)
  },
  mounted() {
    this.$refs.scrollbar.wrap.addEventListener('scroll', this.handle)
  },
  methods: {
    async handle(e) {
      const { target } = e
      const { scrollTop, scrollHeight, clientHeight } = target
      if (scrollTop >= (scrollHeight - clientHeight - 100)) {
        if (this.pageNum >= this.pageSize) return
        await this.loadNextPage()
      }
    },
    async loadNextPage() {
      this.pageNum++
      this.canvasSize++
      return this.getPage(this.pdf, this.pageNum)
    },
    async getPage(pdf, pageNum) {
      const page = await pdf.getPage(pageNum)
      var scale = 1
      var viewport = page.getViewport({ scale: scale })
      // Support HiDPI-screens.
      var outputScale = window.devicePixelRatio || 1

      var canvas = this.$refs.canvas[pageNum - 1]
      var context = canvas.getContext('2d')

      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = Math.floor(viewport.width) + 'px'
      canvas.style.height = Math.floor(viewport.height) + 'px'

      var transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null

      var renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      }
      return page.render(renderContext).promise
    },
    async readPdf(url) {
      this.loading = true
      // eslint-disable-next-line no-undef
      const loadingTask = pdfjsLib.getDocument(url)
      this.pdf = await loadingTask.promise
      this.pageSize = this.pdf.numPages
      await this.getPage(this.pdf, this.pageNum)
      if (this.pageSize > 1) {
        await this.loadNextPage()
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  .scrollbar {
    margin: 0 auto;
    width: 610px;
    height: 100vh;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
