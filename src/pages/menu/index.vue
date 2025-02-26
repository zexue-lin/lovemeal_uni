<template>
  <div>
    <section v-if="!showLoading" class="shop_container">
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
                <!-- 当前菜单项的索引 index 和 menuIndex 相等，那么为该菜单项添加 activity_menu 类 -->
                <li
                  v-for="(item, index) in menuList"
                  :key="index"
                  class="menu_left_li"
                  :class="{ activity_menu: index === menuIndex }"
                  @click="chooseMenu(index)"
                >
                  <span>{{ item.name }}</span>
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
                    <p class="description_tip" v-if="index == TitleDetailIndex">
                      <span>{{ item.name }}</span>
                      {{ item.description }}
                    </p>
                  </header>
                  <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                    <router-link
                      :to="{
                        path: './foodDetail',
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
                        <img src="/static/images/n14.jpg" />
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
                        <span>20起送</span>
                      </section>
                    </footer>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </transition>
    </section>
    <loading v-show="showLoading || loadRatings"></loading>
    <section class="animation_opactiy shop_back_svg_container" v-if="showLoading">
      <img src="../../static/images/shop_back_svg.svg" />
    </section>
    <Tabbar />
  </div>
</template>
<script>
  import Tabbar from 'components/common/tabbar'
  import loading from 'components/common/loading'
  import { loadMore } from 'components/common/mixin'
  import BScroll from 'better-scroll'
  export default {
    components: {
      Tabbar,
      loading,
    },
    mixins: [loadMore],
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
        showLoading: true, //显示加载动画
        loadRatings: false, //加载更多评论是显示加载组件
        changeShowType: 'food', //切换显示商品或者评价
        menuIndex: 0, //已选菜单索引值，默认为0
        menuIndexChange: true, //解决选中index时，scroll监听事件重复判断设置index的bug
        shopListTop: [], //商品列表的高度集合
        foodScroll: null, //食品列表scroll
        TitleDetailIndex: null, //点击展示列表头部详情
        // 菜单列表
        menuList: [
          {
            name: '热销榜',
            icon_url: 'hot.png',
            type: 1,
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n1.jpg',
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
                attributes: [
                  // ✅ 添加 attributes 数据
                  { icon_name: '新', icon_color: 'FF0000' }, // 新品标签，红色
                  { icon_name: '特价', icon_color: '00FF00' }, // 绿色特价标签
                ],
              },
              {
                name: '宫保鸡丁',
                image_path: 'images/n11.png',
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
                attributes: [], // ✅ 即使没有属性，也提供空数组，避免错误
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
                image_path: 'images/n1.jpg',
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
          {
            name: '热销榜1',
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n1.jpg',
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
                image_path: 'images/n11.jpg',
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
            name: '热销榜22',
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n12.jpg',
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
                attributes: [
                  { icon_name: '新', icon_color: '0000FF' }, // 蓝色新品标签
                ],
              },
              {
                name: '宫保鸡丁',
                image_path: 'images/n13.jpg',
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
            name: '热销榜333',
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n14.jpg',
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
                image_path: 'images/n6.jpg',
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
            name: '热销榜333',
          },
          {
            name: '热销榜333',
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n14.jpg',
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
                image_path: 'images/n1.jpg',
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
            name: '热销榜333',
            foods: [
              {
                name: '红烧肉',
                image_path: 'images/n1.jpg',
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
                image_path: 'images/n1.jpg',
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
            name: '热销榜333',
          },
          {
            name: '热销榜333',
          },
          {
            name: '热销榜333',
          },
          {
            name: '热销榜333',
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
    mounted() {
      this.initData()
      this.windowHeight = window.innerHeight
    },
    methods: {
      async initData() {
        try {
          this.hideLoading() // 数据加载完成后再隐藏加载动画
        } catch (error) {
          console.error('Error loading menu data:', error)
          this.hideLoading() // 即使发生错误，也隐藏加载动画
        }
      },
      //获取食品列表的高度，存入shopListTop
      getFoodListHeight() {
        const listContainer = this.$refs.menuFoodList
        if (listContainer) {
          const listArr = Array.from(listContainer.children[0].children)
          listArr.forEach((item, index) => {
            this.shopListTop[index] = item.offsetTop
          })
          this.listenScroll(listContainer)
        }
      },
      //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
      listenScroll(element) {
        this.foodScroll = new BScroll(element, {
          probeType: 3,
          deceleration: 0.001,
          bounce: false,
          swipeTime: 2000,
          click: true,
        })

        const wrapperMenu = new BScroll('#wrapper_menu', {
          click: true,
        })

        const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight
        this.foodScroll.on('scroll', pos => {
          if (!this.$refs.wrapperMenu) {
            return
          }
          this.shopListTop.forEach((item, index) => {
            if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
              this.menuIndex = index
              const menuList = this.$refs.wrapperMenu.querySelectorAll('.activity_menu')
              const el = menuList[0]
              wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight / 2 - 50))
            }
          })
        })
      },

      //加载更多评论
      async loaderMoreRating() {
        if (this.preventRepeatRequest) {
          return
        }
        this.loadRatings = true
        this.preventRepeatRequest = true
        this.ratingOffset += 10
        let ratingDate = await getRatingList(this.shopId, this.ratingOffset, this.ratingTagName)
        this.ratingList = [...this.ratingList, ...ratingDate]
        this.loadRatings = false
        if (ratingDate.length >= 10) {
          this.preventRepeatRequest = false
        }
      },
      //点击左侧食品列表标题，相应列表移动到最顶层
      chooseMenu(index) {
        this.menuIndex = index
        //menuIndexChange解决运动时listenScroll依然监听的bug
        this.menuIndexChange = false
        this.foodScroll.scrollTo(0, -this.shopListTop[index], 400)
        this.foodScroll.on('scrollEnd', () => {
          this.menuIndexChange = true
        })
      },

      // 菜品分类右侧三个点
      showTitleDetail(index) {
        if (this.TitleDetailIndex == index) {
          this.TitleDetailIndex = null
        } else {
          this.TitleDetailIndex = index
        }
      },
      //隐藏动画
      hideLoading() {
        this.showLoading = false
      },
    },
    watch: {
      //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
      showLoading: function (value) {
        if (!value) {
          this.$nextTick(() => {
            this.getFoodListHeight()
          })
        }
      },
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
  @import '@/static/style/menu';
</style>
