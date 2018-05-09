/**
 * @author [chenhf]
 *
 */

Vue.component('search-select-drop-down', {
  template: `
            <div class="">
              <form>
                <input class="layui-input" type="text" @mousedown="mousedown()" v-model="searchVal" @blur="blur">
                <ul class="search-select-drop-down-ul" v-if="isShow" @scroll="scroll($event)">
                  <li v-for="(op , index) in opItems" v-text="op.dictKey" :value="op.dictValue" @mousedown="mousedown(index)"></li>
                </ul>
              </form>
            </div>
            `,
  data: function() {
    return {
      opItems: [], // 下拉框选择内容
      searchVal: this.inputValue ? this.inputValue : '', // input框输入值
      mouseDown: false, // 是否选中下拉框内容
      tips: '', // 验证tips
      isShow: false, // 下拉框状态（是否显示下拉框）
      dictMsg: {
        dictType: this.dictType,
        dictKey: this.searchVal ? this.searchVal : '',
      }, // 字典属性
      dictList: [], // 字典
      index: this.listIndex, // 适用于列表中添加组件
      cacheDict: [], // 缓存字典(用于数据量较大的字典)
      scrollBottom: false, // 判断滚动条是否到底部
    }
  },
  props: {
    inputValue: {
      type: String,
      default: '',
      required: false
    }, // 父组件传来的输入框的值
    dictType: {
      type: String,
      default: '',
      required: true
    }, // 父组件传来的字典名称
    required: {
      type: Boolean,
      default: false
    }, // 是否必填项
    callback: {
      type: Function,
      required: false
    }, // 回调函数
    listIndex: {
      type: Number,
      required: false
    }
  },
  methods: {
    // 搜索下拉框初始化（初始化下拉框内容及字典）
    init() {
      var self = this;
      // 字典与下拉框选项初始化
      self.dictList = top.gobalDict[self.dictMsg.dictType];
      setTimeout(function(){
            for (var i = 0; i < self.dictList.length; i++) {
                i < 100 ? self.opItems.push(self.dictList[i]) : self.cacheDict.push(self.dictList[i])
            }
        },100)


      //   new Promise(function() {
      //   $.ajax({
      //     url: orgDeptWeb + '/api/dict/getDictList',
      //     data: self.dictMsg,
      //     async: true,
      //   }).then(function(res) {
      //     for (var i = 0; i < res.data.length; i++) {
      //       i < 100 ? self.opItems.push(res.data[i]) : self.cacheDict.push(res.data[i])
      //     }
      //     self.dictList = res.data;
      //   })
      // })
      // getDictionaryList(self.dictMsg, true, function(res) {
      //   for (var i = 0; i < res.length; i++) {
      //     i < 100 ? self.opItems.push(res[i]) : self.cacheDict.push(res[i])
      //   }
      //   self.dictList = res;
      // })

    },
    // 鼠标点击触发事件
    mousedown(index) {
      var self = this;
      // 选中下拉框待选项触发事件
      if (index || index == 0) {
        self.searchVal = self.opItems[index].dictKey;
        // 触发dictValue事件，将dictValue及dictKey传给父组件
        self.$emit('dict-value', [self.opItems[index].dictValue, self.opItems[index].dictKey, self.index]);
        self.isShow = false;
        self.mouseDown = true;
      }
      // 点击input框触发事件
      else {
        self.isShow = true;
      }
      // 判断是否有回调函数
      if (typeof(self.callback) == 'function') {
        self.callback()
      }
    },
    // input框光标消失触发事件
    blur() {
      var self = this;
      if (self.mouseDown) {
        self.isShow = false;
        self.mouseDown = false;
        return;
      }
      var dictValue = '';
      var match = false;
      if (self.opItems.length == 0) {
        self.searchVal = '';
      }
      // 循环验证输入值是否与字典值匹配，匹配则跳出循环，自动将值选上
      for (var i = 0; i < self.opItems.length; i++) {
        if (self.searchVal == self.opItems[i].dictKey) {
          self.searchVal = self.opItems[i].dictKey;
          dictValue = self.opItems[i].dictValue;
          match = true
          break;
        }
        // self.searchVal.trim() != self.opItems[i].dictKey.trim() ? self.searchVal = '' : self.searchVal = self.opItems[i].dictKey.trim();
        // self.searchVal.trim() != self.opItems[i].dictKey.trim() ? dictValue = '' : dictValue = self.opItems[i].dictValue;
      }
      if (!match) {
        self.searchVal = '';
        dictValue = '';
      }
      self.$emit('dict-value', [dictValue, self.searchVal, self.index]);
      self.isShow = false;
      if (typeof(self.callback) == 'function') {
        self.callback()
      }
    },
    // 滚动条滚动到底部加载数据
    scroll(e) {
      var self = this;
      $('.search-select-drop-down-ul').scroll(function() {
        if (this.clientHeight + this.scrollTop == this.scrollHeight && !self.scrollBottom) {
          for (var i = 0; i < 100; i++) {
            self.opItems.push(self.cacheDict[0]);
            self.cacheDict.shift()
          }
          self.scrollBottom = true;
        } else if (this.clientHeight + this.scrollTop != this.scrollHeight) {
          self.scrollBottom = false;
        }
      })
      return
    },
    // 匹配键值对
    match() {
      var self = this;
      var match = false;

      for (var i = 0; i < self.dictList.length; i++) {
        if (self.searchVal.trim() == self.dictList[i].dictKey.trim()) {
          self.searchVal = self.dictList[i].dictKey.trim();
          dictValue = self.dictList[i].dictValue;
          match = true
          break;
        }
      }
      if (!match) {
        // self.searchVal = '';
        dictValue = '';
      }
      self.$emit('dict-value', [dictValue, self.searchVal, self.index]);

      // new Promise(function() {
      //   $.ajax({
      //     url: orgDeptWeb + '/api/dict/getDictList',
      //     data: self.dictMsg,
      //     async: true,
      //   }).then(function(res) {
      //     for (var i = 0; i < self.dictList.length; i++) {
      //       if (self.searchVal.trim() == self.dictList[i].dictKey.trim()) {
      //         self.searchVal = self.dictList[i].dictKey.trim();
      //         dictValue = self.dictList[i].dictValue;
      //         match = true
      //         break;
      //       }
      //     }
      //     if (!match) {
      //       // self.searchVal = '';
      //       dictValue = '';
      //     }
      //     self.$emit('dict-value', [dictValue, self.searchVal, self.index]);
      //
      //   })
      // })
    }
  },
  watch: {
    'searchVal': function(newVal, oldVal) {
      var self = this;
      self.dictMsg.dictKey = newVal.trim();
      if (newVal.trim() != oldVal.trim()) {
        if (newVal.trim() == '') {
          self.cacheDict = [];
          self.opItems = [];
          getDictionaryList(self.dictMsg, true, function(res) {
            for (var i = 0; i < res.length; i++) {
              i < 100 ? self.opItems.push(res[i]) : self.cacheDict.push(res[i])
            }
          })
          return;
        }
        getDictionaryList(self.dictMsg, true, function(res) {
          self.opItems = res;
        })
      }
    },
    'inputValue': function(newVal, oldVal) {
      var self = this;
      self.searchVal = newVal;
    },
    // 'dictKey': function(newVal, oldVal) {
    //   var self = this;
    //   if (newVal.trim() === '') {
    //     self.searchVal = ''
    //   }
    // }
  },
  mounted() {
    this.init();
  }
})

/**
 * 获取字典方法
 * @param {Object} dictMsg : 字典参数
 * @param {Boolean} async : 是否异步请求
 * @param {Function} fn : 回调函数
 */
function getDictionaryList(dictMsg, async, fn) {
  $.ajax({
    url: orgDeptWeb + '/api/dict/getDictList',
    data: dictMsg,
    async: async,
    success(res) {
      if (res && res.status == 200) {
        fn && fn(res.data)
      }
    }
  })
}

// function getDictionaryList(dictMsg) {
//   $.ajax({
//     url: orgDeptWeb + '/api/dict/getDictList',
//     data: dictMsg,
//     async: false,
//     // success(res) {
//     //   if (res && res.status == 200) {
//     //     fn && fn(res.data)
//     //   }
//     // }
//   })
// }
