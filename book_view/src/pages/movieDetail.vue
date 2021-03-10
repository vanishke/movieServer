<template lang="html">
  <!--此页面需要-->
  <div class="container">
    <div>
      <movie-index-header ></movie-index-header>   <!--  展示引入的header组件 -->
    </div>
    <div class="contentMain">
      <div class="">
        <h1>{{detail.movieName}}</h1>
        <div class="viewNum">下载次数：{{detail.movieNumDownload}}</div>
      </div>
      <div class="">
        <button v-on:click=movieDownload()>点击下载</button>
      </div>
      <div>
        <img class="headerImg" v-bind:src=detail.movieImg>
      </div>
      <div  v-on:click="support()" class="btnPosition">
        <div class="SupportBtn">点赞<div>{{detail.movieNumSuppose}}</div></div>
      </div>
    </div>
    <div>
      <comment v-bind:movie_id="movie_id"></comment>
    </div>
    <div>
      <common-footer></common-footer>  <!--  展示引入的footer组件 -->
    </div>
  </div>
</template>
<script>
  import MovieIndexHeader from '../components/movieIndexHeader'
  import CommonFooter from '../components/commonFooter'
  import Comment  from '../components/comment.vue'

  let movie_id=0
  export default {
    name: 'MovieDetail',
    data () {
      return {
        detail: [],
        movie_id:'',
      }
    },
    components: {
      MovieIndexHeader,
      CommonFooter,
      Comment,
    },

//  这里用于获取数据，需要获得主页推荐，主页新闻列表，主页电影列表
    created () {
//    this.$route.query.id
      this.movie_id=this.$route.query.id
      movie_id=this.$route.query.id
      this.$http.post('http://localhost:3000/movie/detail',{id: movie_id}).then((data) => {
        this.detail = data.body.data;
//      console.log( data.body.data)
      })
    },
    methods:{
      support:function (event) {
        this.$http.post('http://localhost:3000/movie/support',{id:movie_id}).then((data1)=>{
          let data_temp= data1.body
          let that=this
          console.log(data_temp)
          if(data_temp.status===0){
            this.$http.post('http://localhost:3000/movie/showNumber',{id:movie_id}).then((data2)=>{
//            console.log(data2)
              that.detail['movieNumSuppose']=data2.body.data.movieNumSuppose
            })
          }else{
            alert(data_temp.message)
          }

        })
      },
//    电影下载
      movieDownload:function (event) {
        this.$http.post('http://localhost:3000/movie/download',{movie_id:movie_id}).then((data1)=>{
          if(data1.status==1)
          {
            alert(data1.message)
          }
          else
          {
              this.download(data1.body.data)
              // window.location.href = data1.body.data;
          }
        })
      },
      getUrlBase64(url) {
        return new Promise(resolve => {
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          let img = new Image()
          img.crossOrigin = 'Anonymous' //允许跨域
          img.src = url
          img.onload = function() {
            canvas.height = 300
            canvas.width = 300
            ctx.drawImage(img, 0, 0, 300, 300)
            let dataURL = canvas.toDataURL('image/png')
            canvas = null
            resolve(dataURL)
          }
        })
      },
      download(url) {
        this.getUrlBase64(url).then(base64 => {
          let link = document.createElement('a')
          link.href = base64
          link.download = 'qrCode.png'
          link.click()
        })
      }
    }
  }
</script>

<style lang="css" scoped>
  .headerImg{
    height: 200px;
  }
  .container {
    width: 100%;
    margin: 0 auto;
  }
  .contentMain{
    padding-top: 150px;
  }

  .btnPosition{
    padding-left: 48%;
  }
  .SupportBtn{
    border: solid 1px #000;
    width: 60px;
  }
  .viewNum{
    font-size: 10px;
  }
</style>
