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
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="setFilterPop" >Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter --> 
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='All'}" @click="setPriceFilter('All')">All</a></dd>
                <dd v-for="(item,index) in priceFilter" :key=index>
                  <a href="javascript:void(0)" @click="setPriceFilter(index,item.startPrice,item.endPrice)" :class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" :key=index>
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <img src="../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="setFilterPop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
import NavBread from '@/components/NavBread';
import axios from 'axios';
    export default{
        data(){
            return {
              goodsList:[],
              priceFilter:[
                {
                  startPrice:'0.00',
                  endPrice:'100.00'
                },
                {
                  startPrice:'100.00',
                  endPrice:'500.00'
                },
                {
                  startPrice:'500.00',
                  endPrice:'1000.00'
                },
                {
                  startPrice:'1000',
                  endPrice:'2000'
                }
              ],
              priceChecked: 'All',
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:true,
              startPrice:'0',
              endPrice:'10000'
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
        mounted:function(){
          this.getGoodsList();
        },
        methods: {
          getGoodsList(flag){
            let params={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              startPrice:this.startPrice,
              endPrice:this.endPrice
            };
            this.loading = true;
              axios.get("/goods",{
                params:params
              }).then((res)=>{
                this.loading = false;
                if(flag){
                  this.goodsList = this.goodsList.concat(res.data.result.list);
                  if(res.data.result.count===0){
                    this.busy = true;
                  }else if(res.data.result.count<8){
                    this.busy = true;
                  }else {
                    this.busy = false;
                  }
                }else{
                   this.goodsList = res.data.result.list;
                   this.busy = false;
                }
              })
          },
          setPriceFilter(value,startPrice,endPrice){
            if(value!=='All'){
              this.startPrice = startPrice;
              this.endPrice = endPrice;
            }else {
              this.startPrice = '0';
              this.endPrice = '10000';
            }
            console.log(this.startPrice,this.endPrice)
            this.priceChecked = value;
            this.filterBy = false;
            this.overLayFlag = false;
            this.page=1;
            this.getGoodsList();
          },
          setFilterPop(){
            this.filterBy = !this.filterBy;
            this.overLayFlag = !this.overLayFlag;
          },
          sortGoods(){
            console.log('1');
            this.sortFlag = !this.sortFlag;
            this.page=1;
            this.getGoodsList();
          },
          loadMore(){
            this.busy = true;
            setTimeout(()=>{
              this.page++;
              this.getGoodsList(true)
            },500)
          },
          addCart(productId){
            axios.post('/goods/addCart',{
                productId:productId
            }).then((res)=>{
              let data = res.data;
              if(data.status==="0"){
                alert("加入成功");
              }else {
                alert("加入失败")
              }
            })
          }
        }
    }
</script>
<style>
.loading {
  text-align: center;
}
</style>
