import Vue from "Vue";
import HelloWorld from "./HelloWorld.vue";

// new Vue({
//   el: "#app",
//   template: "<HelloWorld/>",
//   component: { HelloWorld }
// });
new Vue({
  el: "#app",
  render: h => h(HelloWorld)
});