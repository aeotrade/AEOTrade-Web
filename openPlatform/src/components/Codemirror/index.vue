<template>
  <el-dialog
    title="设置生成规则"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="900px">
    <codemirror
      ref="mycode"
      v-model="curCode"
      :options="cmOptions"
      class="code">
    </codemirror>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$parent.show = false">取 消</el-button>
      <el-button size="small" type="primary" @click="importJson">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // 引入CodeMirror和基础样式
  import CodeMirror from "codemirror";
  import "codemirror/lib/codemirror.css";
  // JSON代码高亮需要由JavaScript插件支持
  import "codemirror/mode/javascript/javascript.js";
  // 选择IDEA主题样式，还有其他很多主题可选
  import "codemirror/theme/idea.css";
  // 支持使用Sublime快捷键
  import "codemirror/keymap/sublime.js";
  // 搜索功能的依赖
  import "codemirror/addon/dialog/dialog.js";
  import "codemirror/addon/dialog/dialog.css";
  // 支持搜索功能
  import "codemirror/addon/search/search";
  import "codemirror/addon/search/searchcursor.js";
  // 支持各种代码折叠
  import "codemirror/addon/fold/foldgutter.css";
  import "codemirror/addon/fold/foldcode.js";
  import "codemirror/addon/fold/foldgutter.js";
  import "codemirror/addon/fold/brace-fold.js";
  import "codemirror/addon/fold/comment-fold.js";
  // 支持代码区域全屏功能
  import "codemirror/addon/display/fullscreen.css";
  import "codemirror/addon/display/fullscreen.js";
  // 支持括号自动匹配
  import "codemirror/addon/edit/matchbrackets.js";
  import "codemirror/addon/edit/closebrackets.js";
  // 支持代码自动补全
  import "codemirror/addon/hint/show-hint.css";
  import "codemirror/addon/hint/show-hint.js";
  import "codemirror/addon/hint/anyword-hint.js";
  import "codemirror/addon/comment/comment.js";
  import "codemirror/addon/lint/lint.css";
  import "codemirror/addon/lint/lint.js";
  import "codemirror/addon/lint/json-lint.js";
  import jsonlint from "jsonlint-mod";
  window.jsonlint = jsonlint;

  import {codemirror} from 'vue-codemirror';

  export default {
    name: "index",
    components:{
      codemirror
    },
    data(){
      return{
        dialogVisible:true,
        curCode:'[]',
        cmOptions:{
          lint: true,
          lineNumbers: true,
          mode: "application/json",  // 接受的类型，json xml....
          gutters: [
            "CodeMirror-linenumbers",
            "CodeMirror-foldgutter",
            "CodeMirror-lint-markers",      // CodeMirror-lint-markers是实现语法报错功能
          ],
          theme: "ambiance"
        }
      }
    },
    methods:{
      importJson(){
        // this.dialogVisible = false
        if(!this.curCode){
          this.$parent.show = false
        }else {
          try{
            JSON.parse(this.curCode)
          }catch (e) {
            this.$message.error('输入内容格式有误!')
            return;
          }
          this.$emit('importJson',JSON.parse(this.curCode))
        }

      }
    }
  }
</script>

<style scoped>

</style>
