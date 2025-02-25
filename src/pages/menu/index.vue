<template>
  <div>
    <section style="padding: 0.5rem">
      <u-swiper :list="header_list" keyName="image" showTitle :autoplay="true" circular height="150px"></u-swiper>
    </section>
    <!-- 中间选择 -->
    <section class="change_show_type" ref="chooseType">
      <div>
        <span :class="{ activity_show: changeShowType == 'food' }" @click="changeShowType = 'food'">商品</span>
      </div>
      <div>
        <span :class="{ activity_show: changeShowType == 'rating' }" @click="changeShowType = 'rating'">评价</span>
      </div>
    </section>
    <!-- 选择商品 -->
    <transition name="fade-choose">
      <section v-show="changeShowType == 'food'" class="food_container">
        <section class="menu_container">
          <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
            <ul>
              <li v-for="(item, index) in menuList" :key="index" class="menu_left_li" @click="chooseMenu(index)">
                <!-- <img :src="getImgPath(item.icon_url)" v-if="item.icon_url" /> -->
                <span>{{ item.name }}</span>
                <!-- <span class="category_num" v-if="categoryNum[index] && item.type == 1">{{ categoryNum[index] }}</span> -->
              </li>
            </ul>
          </section>
          <section class="menu_right" ref="menuFoodList">
            <ul>
              <li v-for="(item, index) in menuList" :key="index">
                <header class="menu_detail_header">
                  <section class="menu_detail_header_left">
                    <strong class="menu_item_title">{{ item.name }}</strong>
                    <span class="menu_item_description">{{ item.description }}</span>
                  </section>
                  <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                </header>
                <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                  <router-link
                    :to="{
                      path: 'shop/foodDetail',
                      query: {
                        image_path: foods.image_path,
                        description: foods.description,
                        month_sales: foods.month_sales,
                        name: foods.name,
                        rating: foods.rating,
                        rating_count: foods.rating_count,
                        satisfy_rate: foods.satisfy_rate,
                        foods,
                      },
                    }"
                    tag="div"
                    class="menu_detail_link"
                  >
                    <section class="menu_food_img">
                      <img src="/static/images/n1.jpg" />
                    </section>
                    <section class="menu_food_description">
                      <h3 class="food_description_head">
                        <strong class="description_foodname">{{ foods.name }}</strong>
                        <ul v-if="foods.attributes" class="attributes_ul">
                          <li
                            v-if="attribute"
                            v-for="(attribute, foodindex) in foods.attributes"
                            :key="foodindex"
                            :style="{ color: '#' + attribute.icon_color, borderColor: '#' + attribute.icon_color }"
                            :class="{ attribute_new: attribute.icon_name == '新' }"
                          >
                            <p :style="{ color: attribute.icon_name == '新' ? '#fff' : '#' + attribute.icon_color }">
                              {{ attribute.icon_name == '新' ? '新品' : attribute.icon_name }}
                            </p>
                          </li>
                        </ul>
                      </h3>
                      <p class="food_description_content">{{ foods.description }}</p>
                      <p class="food_description_sale_rating">
                        <span>月售{{ foods.month_sales }}份</span>
                        <span>好评率{{ foods.satisfy_rate }}%</span>
                      </p>
                      <p v-if="foods.activity" class="food_activity">
                        <span :style="{ color: '#' + foods.activity.image_text_color, borderColor: '#' + foods.activity.icon_color }">{{
                          foods.activity.image_text
                        }}</span>
                      </p>
                    </section>
                  </router-link>
                  <footer class="menu_detail_footer">
                    <section class="food_price">
                      <span>¥</span>
                      <span>{{ foods.specfoods[0].price }}</span>
                      <span>2起</span>
                    </section>
                    <buy-cart
                      :shopId="shopId"
                      :foods="foods"
                      @moveInCart="listenInCart"
                      @showChooseList="showChooseList"
                      @showReduceTip="showReduceTip"
                      @showMoveDot="showMoveDotFun"
                    ></buy-cart>
                  </footer>
                </section>
              </li>
            </ul>
          </section>
        </section>
        <section class="buy_cart_container">
          <section @click="toggleCartList" class="cart_icon_num">
            <div class="cart_icon_container" :class="{ cart_icon_activity: totalPrice > 0, move_in_cart: receiveInCart }" ref="cartContainer">
              <span v-if="totalNum" class="cart_list_length">
                {{ totalNum }}
              </span>
              <svg class="cart_icon">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
              </svg>
            </div>
            <div class="cart_num">
              <div>¥ {{ totalPrice }}</div>
              <div>配送费¥{{ deliveryFee }}</div>
            </div>
          </section>
          <section class="gotopay" :class="{ gotopay_acitvity: minimumOrderAmount <= 0 }">
            <span class="gotopay_button_style" v-if="minimumOrderAmount > 0">还差¥{{ minimumOrderAmount }}起送</span>
            <router-link :to="{ path: '/confirmOrder', query: { geohash, shopId } }" class="gotopay_button_style" v-else>去结算</router-link>
          </section>
        </section>
        <!-- <transition name="toggle-cart">
          <section class="cart_food_list" v-show="showCartList && cartFoodList">
            <header>
              <h4>购物车</h4>
              <div @click="clearCart">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                </svg>
                <span class="clear_cart">清空</span>
              </div>
            </header>
            <section class="cart_food_details" id="cartFood">
              <ul>
                <li v-for="(item, index) in cartFoodList" :key="index" class="cart_food_li">
                  <div class="cart_list_num">
                    <p class="ellipsis">{{ item.name }}</p>
                    <p class="ellipsis">{{ item.specs }}</p>
                  </div>
                  <div class="cart_list_price">
                    <span>¥</span>
                    <span>{{ item.price }}</span>
                  </div>
                  <section class="cart_list_control">
                    <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                      <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                      </svg>
                    </span>
                    <span class="cart_num">{{ item.num }}</span>
                    <svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                    </svg>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </transition>
        <transition name="fade">
          <div class="screen_cover" v-show="showCartList && cartFoodList" @click="toggleCartList"></div>
        </transition> -->
      </section>
    </transition>
    <Tabbar />
  </div>
</template>
<script>
  import Tabbar from 'components/common/tabbar.vue'
  export default {
    components: {
      Tabbar,
    },
    data() {
      return {
        // 头部swiper
        header_list: [
          {
            image: '/static/images/n11.png',
            title: '展示1',
          },
          {
            image: '/static/images/n12.jpg',
            title: '展示2',
          },
          {
            image: '/static/images/n15.jpg',
            title: '展示3',
          },
        ],
        changeShowType: 'food', //切换显示商品或者评价
        // 菜单列表
        menuList: [
          {
            name: '热销榜',
            icon_url: 'hot.png',
            type: 1,
            foods: [
              {
                name: '红烧肉',
                image_path: 'hongshaorou.jpg',
                description: '经典红烧肉，肥而不腻',
                month_sales: 100,
                rating: 4.5,
                rating_count: 50,
                satisfy_rate: 95,
                specfoods: [
                  {
                    price: 38,
                  },
                ],
              },
              {
                name: '宫保鸡丁',
                image_path: 'gongbaojiding.jpg',
                description: '酸甜可口，鸡肉鲜嫩',
                month_sales: 80,
                rating: 4.2,
                rating_count: 40,
                satisfy_rate: 90,
                specfoods: [
                  {
                    price: 28,
                  },
                ],
              },
            ],
          },
          {
            name: '新品榜',
            icon_url: 'drink.png',
            type: 1,
            foods: [
              {
                name: '可乐',
                image_path: 'cola.jpg',
                description: '冰镇可乐，畅爽一夏',
                month_sales: 200,
                rating: 4.8,
                rating_count: 100,
                satisfy_rate: 98,
                specfoods: [
                  {
                    price: 5,
                  },
                ],
              },
            ],
          },
        ],
        // 购物车数据
        cartFoodList: [],

        // 店铺详情数据
        shopDetailData: {
          rating: 4.5,
          order_lead_time: 30,
        },

        // 评价数据
        ratingScoresData: {
          compare_rating: 0.9,
          service_score: 4.6,
          food_score: 4.5,
        },

        // 评价标签数据
        ratingTagsList: [
          { name: '全部', count: 100, unsatisfied: false },
          { name: '满意', count: 80, unsatisfied: false },
          { name: '不满意', count: 20, unsatisfied: true },
        ],

        // 评价列表数据
        ratingList: [
          {
            username: '用户1',
            avatar: 'user1.jpg',
            rating_star: 5,
            time_spent_desc: '30分钟',
            rated_at: '2023-10-01',
            item_ratings: [
              {
                food_name: '红烧肉',
                image_hash: 'hongshaorou.jpg',
              },
            ],
          },
          {
            username: '用户2',
            avatar: 'user2.jpg',
            rating_star: 4,
            time_spent_desc: '25分钟',
            rated_at: '2023-10-02',
            item_ratings: [
              {
                food_name: '宫保鸡丁',
                image_hash: 'gongbaojiding.jpg',
              },
            ],
          },
        ],
      }
    },
    created() {},
    computed: {},
    methods: {},
    watch: {
      //商品、评论切换状态
      changeShowType: function (value) {
        if (value === 'rating') {
          this.$nextTick(() => {
            this.ratingScroll = new BScroll('#ratingContainer', {
              probeType: 3,
              deceleration: 0.003,
              bounce: false,
              swipeTime: 2000,
              click: true,
            })
            this.ratingScroll.on('scroll', pos => {
              if (Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
                this.loaderMoreRating()
                this.ratingScroll.refresh()
              }
            })
          })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import '@/static/style/mixin';
  .menu_detail {
    display: flex;
    padding: 0.625rem;
  }
  .change_show_type {
    display: flex;
    background-color: #fff;
    padding: 0.3rem 0 0.6rem;
    border-bottom: 1px solid #ebebeb;
    div {
      flex: 1;
      text-align: center;
      span {
        @include sc(0.65rem, #666);
        padding: 0.2rem 0.1rem;
        border-bottom: 0.12rem solid #fff;
      }
      .activity_show {
        color: #3190e8;
        border-color: #3190e8;
      }
    }
  }
  .menu_container {
    display: flex;
    flex: 1;
    overflow-y: hidden;
    position: relative;
    .menu_left {
      width: 3.8rem;
      .menu_left_li {
        padding: 0.7rem 0.3rem;
        border-bottom: 0.025rem solid #ededed;
        box-sizing: border-box;
        border-left: 0.15rem solid #f8f8f8;
        position: relative;
        list-style-type: none;
        span {
          @include sc(0.6rem, #666);
        }
        .category_num {
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          background-color: #ff461d;
          line-height: 0.6rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: 0.6rem;
          height: 0.6rem;
          @include sc(0.5rem, #fff);
          font-family: Helvetica Neue, Tahoma, Arial;
        }
      }
      .activity_menu {
        border-left: 0.15rem solid #3190e8;
        background-color: #fff;
        span:nth-of-type(1) {
          font-weight: bold;
        }
      }
    }
  }
</style>
