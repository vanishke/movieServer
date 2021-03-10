<template lang="html">
  <div>
    <div>
      <div>
        <input v-model="toUserName" placeholder="发送用户名">
      </div>
      <div  style="padding:10px">
        <input v-model="title" placeholder="发送标题">
      </div>
    </div>
    <div style="padding:5px">
      <textarea v-model="context" style="width:80%;height:50px;" placeholder="内容">
      </textarea>
    </div>
    <div style="padding-top:10px">
      <button v-on:click="send_email()">发送站内信</button>
    </div>
</div>
</template>
<script>
  export default{
    props: [],
    data()
    {
      return{
        toUserName: '',
        title: '',
        context: ''
      }
    },
    methods: {
      send_email(event) {
        localStorage.clear();
        let send_data =
          {
            toUserName: this.toUserName,
            token: localStorage.getItem('token'),
            user_id: localStorage.getItem('_id'),
            title: this.title,
            context: this.context
          }
        this.$http.post('http://10.9.212.55:3000/users/sendEmail', send_data).then((data) => {
          if (data.body.status == 1)
          {
            alert(data.body.message);
          }
          else
          {
            alert('发送成功');
          }
          console.log(data.body.data);
        })
      }
    }
  }
</script>
<style lang="css" scoped>
</style>

