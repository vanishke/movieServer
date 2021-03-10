
<template lang="html" >
<div>
  <label>评论</label>
    <hr>
    <div>
      <li v-for="item in items">
          {{item.username}} 评论： {{item.context}}
      </li>
    </div>
    <div style="padding:5px" >
<textarea v-model= "context" style="width:300px; height:60px;"
          placeholder="内容">
</textarea>
    </div>
    <div style="padding-top:10px">
    <button v-on:click="send_comment()" >评论</button>
</div>
</div>
</template>
<!--获取所有的评论，并且可以回复评论， 对于文章详情页也可以使用 -->
<script>
  export default{
    props: ['movie_id'],
    data()
    {
      return{
        items: [],
        context:'',
      }
    },
    create()
    {
      this.$http.post('http://10.9.212.55:3000/commentsList',{id:this.movie_id}).then((data) => {
        if(data.status == 0)
        {
          this.items = data.body.data;

        }
        else
        {
            alert('获取失败');
        }
      })
    },
    methods:
    {
      send_comment: function(event)
      {
          let send_data;
          if(typeof(localStorage.getItem('username'))!='undefined')
          {
            send_data=
            {
              movie_id: this.movie_id,
              context: this.context,
              username: localStorage.getItem('username')
            }
          }
          else
          {
            send_data=
            {
              movie_id: this.movie_id,
            context: this.context
            }
          }
          this.$http.post('http://10.9.212.55:3000/users/postComment',send_data).then((data) =>{
            alert(data.body.message);
          })
      }

    }
  }
  </script>
  <style lang="css" scoped>
  </style>
