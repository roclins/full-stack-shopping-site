<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="setFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  :class="{'cur':priceChecked=='All'}"
                  @click="setPriceFilter('All')"
                >All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter" :key="index">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index,item.startPrice,item.endPrice)"
                  :class="{'cur':priceChecked==index}"
                >{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/'+item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="loading"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <img src="../assets/loading-spinning-bubbles.svg" alt v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="setFilterPop"></div>
    <model v-bind:mdShow="isShowAddCartFail" @closeModel="closeAddCartFail">
      <div slot="content">未登录，无法加入购物车</div>
      <div slot="btn">
        <a class="btn btn--m" href="javascript:;" @click="isShowAddCartFail = false">关闭</a>
      </div>
    </model>
    <model v-bind:mdShow="isShowAddCartSuccess" @closeModel="closeAddCartSuccess">
      <div slot="content">加入购物车成功</div>
      <div slot="btn">
        <a class="btn btn--m" href="javascript:;" @click="isShowAddCartSuccess = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </model>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Model from "@/components/Model";
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000",
          endPrice: "5000"
        }
      ],
      priceChecked: "All",  //用于切换 价格帅选 的样式
      filterBy: false,      //控制在 小屏时 的价格帅选功能的弹窗出现与否
      overLayFlag: false,  //控制遮罩层显示
      sortFlag: true,      //传到后端的数据：升序还是降序
      page: 1,            //分页功能
      pageSize: 8,        //一页多少条数据
      busy: true,           //控制懒加载的组件 busy为true则不加载
      loading: true,        //控制加载的图标的显示
      startPrice: "0",      //传到后端的数据：价格帅选功能
      endPrice: "10000",
      isShowAddCartFail: false,  //加入购物车失败的弹窗显示
      isShowAddCartSuccess: false  //加入购物车成功的弹窗
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Model
  },
  mounted: function() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {   //获得商品列表
      let params = {     //传到后盾的参数
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        startPrice: this.startPrice,
        endPrice: this.endPrice
      };
      this.loading = true;   //在等待时，懒加载图标出现
      axios                 //发送axios请求，注意post传参时get传参格式不一样，post 多了一个params
        .get("/goods/list", {
          params: params
        })
        .then(res => {
          this.loading = false;   //获得数据后，懒加载图标消失
          if (flag) {      //flag用来用控制是  第一次加载，还是分页的加载（分页的加载，前面有数据了）
            this.goodsList = this.goodsList.concat(res.data.result.list);  
            //不拼接前面的数据，则会出现，分页的时候，只会显示新的数据，前面的数据会消失
            if (res.data.result.count === 0) {          //当传回来的数据小于8条时，把busy为true，不再继续懒加载
              this.busy = true;
            } else if (res.data.result.count < 8) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.data.result.list;
            this.busy = false;
          }
        });
    },
    setPriceFilter(value, startPrice, endPrice) {  //设置价格过滤
      if (value !== "All") {
        this.startPrice = startPrice;
        this.endPrice = endPrice;
      } else {
        this.startPrice = "0";
        this.endPrice = "10000";
      }
      // console.log(this.startPrice, this.endPrice);
      this.priceChecked = value;
      this.filterBy = false;         //这是控制移动端的按钮，点击之后，弹窗收回
      this.overLayFlag = false;     //遮罩层消失
      this.page = 1;               
      //因为会出现，你在其他价格区间加载到了第3页，你换了一个区间，就从第3页开始加载了，所以，每次设置价格区间，都把page设为1
      this.getGoodsList();  //发送请求
    },
    setFilterPop() {   //控制移动端   弹窗和遮罩层的显示
      this.filterBy = !this.filterBy;
      this.overLayFlag = !this.overLayFlag;
    },
    sortGoods() {    //价格的升序和降序  
      // console.log("1");
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {     
      /*
      loadMore 就是控制懒加载的函数，懒加载函数的启动是，当你滚动距离
      屏幕底部距离为30（这是自己设定的），就会触发loadMore函数，loadMore函数中，加busy置为true，
      懒加载功能可以触发，随后，发送请求
      */
      this.busy = true;   //这个是控制 懒加载 是否 可以触发 
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    addCart(productId) {  //加入购物车功能
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(res => {
          let data = res.data;
          console.log(data);
          if (data.status === "0") {
            this.isShowAddCartSuccess = true;
          } else {
            this.isShowAddCartFail = true;
          }
        });
    },
    closeAddCartFail() {
      this.isShowAddCartFail = false;
    },
    closeAddCartSuccess() {
      this.isShowAddCartSuccess = false;
    }
  }
};
</script>
<style>
.loading {
  text-align: center;
}
</style>
