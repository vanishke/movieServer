<template lang="html">
  <div>
    <div>
      <div>
        <div class ="box" >
          <label>用户名：</label>
          <input v-model="username" placeholder="用户名">
        </div>
        <div class="box" >
          <label>密码：</label>
           <input v-model="password" placeholder="密码">
        </div>
        <div class= "box">
          <label>重复输入密码：</label>
          <input v-model="repassword" placeholder="密码">
        </div>
      </div>
  <div class="box">
    <label>邮箱：</label>
    <input v-model="userMail" placeholder="邮箱">
    </div>
      <div class="box">
        <label>手机：</label>
        <input v-model="userPhone" placeholder="手机">
      </div>

      <div class= "box">
        <button v-on:click="userRegister()">注册</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  //逻辑部分代码
  export default {
    //定义相关的变量
    data () {
      return{
        username: '',
        password: '',
        userPhone: '',
        userMail: '',
        repassword: ''
      }
    },
    methods:
      {
        userRegister: function(event)
        {
          if(this.password != this.repassword)
          {
              alert('两次输入的密码不一致');
              return;
          }
          else
          {
              let saveData= {
                username: this.username,
                password: this.password,
                userMail: this.userMail,
                userPhone: this.userPhone

              }
            this.$http.post('http://localhost:3000/users/register',saveData).then((data) => {
              if(data.body.status == 1)
              {
                alert(data.body.message);
              }
              else
              {
                alert(data.body.message);
                this.$router.go(-1);
              }
            })
          }

        }
      }
  }
  </script>
  <style>
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
  }
  </style>
