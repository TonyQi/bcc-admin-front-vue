<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
    <div class="home-main">
        
    </div>
</template>

<script>
import { ipInfo } from "@/api/index";
import cityData from "./map-data/get-city-value.js";
import homeMap from "./components/map.vue";
import visiteVolume from "./components/visiteVolume.vue";
import userFlow from "./components/userFlow.vue";
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import mapDataTable from "./components/mapDataTable.vue";
import Cookies from "js-cookie";
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";

export default {
  name: "home",
  components: {
    homeMap,
    visiteVolume,
    userFlow,
    countUp,
    inforCard,
    mapDataTable
  },
  data() {
    return {
      showVideo: false,
      count: {
        createUser: 496,
        visit: 3264,
        collection: 24389305,
        transfer: 39503498
      },
      cityData: cityData,
      newToDoItemValue: "",
      city: "",
      weather: "",
      username: ""
    };
  },
  computed: {
    avatarPath() {
      return 'http://img.exrick.cn/992d950bb04c446bae202c639d21b68b.png';
    }
  },
  methods: {
    init() {
      this.username = Cookies.get("username");
      console.log(this.username);
      // ipInfo().then(res => {
      //   if (res.success === true) {
      //     let ipInfo = JSON.parse(res.result);
      //     if (ipInfo.retCode === "200") {
      //       let info = ipInfo.result[0];
      //       let weather =
      //         info.weather +
      //         " " +
      //         info.temperature +
      //         " 污染指数: " +
      //         info.pollutionIndex;
      //       this.city = info.city;
      //       this.weather = weather;
      //     } else {
      //       this.city = "未知";
      //       this.weather = "未知";
      //     }
      //   }
      // });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
