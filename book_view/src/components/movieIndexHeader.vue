<template lang="html">
  <Menu mode="horizontal" theme="dark" active-name="1" >
    <router-link to="/">
      <MenuItem name="1" ><Icon type="ios-paper">主页</Icon></MenuItem>
    </router-link>
    <router-link to="/movieList">
      <MenuItem name="2" ><Icon type="ios-people">电影</Icon></MenuItem>
    </router-link>
  </Menu>
</template>
<script>
export default{

}
</script>

